import {
  Agent,
  type AgentInputItem,
  Runner,
  type Tool,
  user,
} from "@openai/agents";

import { Config } from "./config";
import type { Logger } from "./logger";
import { prepareTools } from "../utils/tools";

export abstract class WrappedAgent {
  history: AgentInputItem[] = [];
  name: string;
  instructions: string;
  config: Config;
  logger: Logger;
  agent?: Agent<unknown, "text">;

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

    if (!this.agent) {
      this.agent = new Agent<unknown, "text">({
        name: this.name,
        model: this.config.openai_model,
        instructions: this.instructions,
        tools,
      });
    } else {
      this.agent.tools = tools;
    }

    const runner = new Runner(this.agent);

    this.history.push(user(prompt));

    const stream = await runner.run(this.agent, this.history, {
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
