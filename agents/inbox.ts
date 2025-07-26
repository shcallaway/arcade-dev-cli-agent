import { WrappedAgent } from "../classes/wrappedAgent";
import type { Config } from "../classes/config";
import type { Logger } from "../classes/logger";

export class InboxAgent extends WrappedAgent {
  constructor(config: Config, logger: Logger) {
    const instructions = `You are a an agent knows everything about Gmail.  You can read and write emails, manage the labels and inbox, etc.`;
    super("InboxAgent", instructions, config, logger);
  }

  async readInbox(numberOfEmails: number) {
    const toolkitNames = ["gmail", "slack"];

    this.logger.startSpan(`Chatting with your inbox...`);

    const stream = await this.run(
      `
You are a helpful assistant that can assist with Google API calls.
What are my latest ${numberOfEmails} emails in my inbox?
Format the response as a markdown table.
Show just the date-time, subject, and sender.
    `,
      toolkitNames,
    );

    this.logger.endSpan();
  }

  async summarizeInboxToSlack(slackUser: string) {
    const toolkitNames = ["gmail", "slack"];

    this.logger.startSpan(`Summarizing inbox to Slack...`);

    const stream = await this.run(
      `
Read all the unread emails in my inbox.
Summarize the emails in a way that is easy to understand, but make them all rhyme.
Send the summary to the slack user: ${slackUser}.
      `,
      toolkitNames,
    );

    this.logger.endSpan();
  }

  async chat(prompt: string, toolkitNames: string[] = []) {
    this.logger.startSpan(
      `thinking about this with toolkits: ${toolkitNames.join(", ")}...`,
    );
    const stream = await this.run(prompt, toolkitNames);
    this.logger.endSpan();
    return stream;
  }
}
