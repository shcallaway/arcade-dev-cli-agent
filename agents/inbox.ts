import { WrappedAgent } from "../classes/wrappedAgent";
import type { Config } from "../classes/config";
import type { Logger } from "../classes/logger";
import Arcade from '@arcadeai/arcadejs';
import { executeOrAuthorizeZodTool, toZod } from "@arcadeai/arcadejs/lib";
import { tool } from "@openai/agents";

const arcadeClient = new Arcade();

const googleToolkit = await arcadeClient.tools.list({ toolkit: "gmail", limit: 99 });
const tools = toZod({
    tools: googleToolkit.items,
    arcadeClient,
    userId: "<YOUR_SYSTEM_USER_ID>",
    // @ts-ignore
    executeFactory: executeOrAuthorizeZodTool,
}).map(tool);

export class InboxAgent extends WrappedAgent {
  constructor(config: Config, logger: Logger) {
    const instructions = `
You are a an agent that reads the inbox and summarizes the emails.
    `;

    super("InboxAgent", instructions, tools, [], config, logger);
  }

  async chat() {
    const result = await this.run(
      `What is my most recent email?`,
    );

    this.logger.endSpan(result.finalOutput);
  }
}