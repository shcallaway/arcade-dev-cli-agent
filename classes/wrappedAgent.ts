import {
  Agent,
  type AgentInputItem,
  Runner,
  type Tool,
  setDefaultOpenAIClient,
  user,
} from "@openai/agents";
import OpenAI from "openai";

import { Config } from "./config";
import type { Logger } from "./logger";
import { prepareTools } from "../utils/tools";

export abstract class WrappedAgent {
  history: AgentInputItem[] = [];
  name: string;
  instructions: string;
  config: Config;
  logger: Logger;

  constructor(
    name: string,
    instructions: string,
    config: Config,
    logger: Logger,
  ) {
    this.name = name;
    this.instructions = instructions;
    this.config = config;
    this.logger = logger;
  }

  public async run(prompt: string, toolkitNames: string[] = [], maxTurns = 10) {
    const tools: Tool[] = [];
    for (const toolkitName of toolkitNames) {
      const toolkitTools = await prepareTools(
        this.config,
        this.logger,
        toolkitName,
      );
      tools.push(...toolkitTools);
    }

    const client = new OpenAI({
      apiKey: this.config.openai_api_key,
    });
    setDefaultOpenAIClient(client);

    const agent = new Agent<unknown, "text">({
      name: this.name,
      model: this.config.openai_model,
      instructions: this.instructions,
      tools,
    });
    const runner = new Runner(agent);

    this.history.push(user(prompt));

    const stream = await runner.run(agent, this.history, {
      maxTurns,
      stream: true,
    });

    stream
      .toTextStream({ compatibleWithNodeStreams: true })
      .pipe(this.logger.stream);
    await stream.completed;
    this.logger.endSpan(stream.finalOutput);

    if (stream.history.length > 0) {
      this.history = stream.history;
    }

    if (stream.finalOutput) {
      this.logger.debug(stream.finalOutput);
    }

    return stream;
  }
}
