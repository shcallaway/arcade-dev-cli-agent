import { WrappedAgent } from "../classes/wrappedAgent";
import type { Config } from "../classes/config";
import type { Logger } from "../classes/logger";

export class InboxAgent extends WrappedAgent {
  constructor(config: Config, logger: Logger) {
    const instructions = `You are a an agent knows everything about Gmail.  You can read and write emails, manage the labels and inbox, etc.`;
    super("InboxAgent", instructions, config, logger);
  }

  // async readInbox(numberOfEmails: number, includeRead: boolean = false) {
  //   const toolkitNames = ["gmail"];

  //   this.logger.startSpan(`Chatting with your inbox...`);

  //   const stream = await this.run(
  //     `
  // TASK: Retrieve and display emails from my inbox

  // REQUIREMENTS:
  // - Get the latest ${numberOfEmails} emails from my inbox
  // - Sort emails by date-time in descending order (newest first)
  // - ${includeRead ? "Include both read and unread emails" : "Include only unread emails"}
  // - Use the Gmail API to check email read/unread status
  // - Request at least 100 emails in each API call to ensure comprehensive results

  // OUTPUT FORMAT:
  // - Present results as a markdown table
  // - Include only these columns: Date-Time, Subject, Sender
  // - Ensure the table is properly formatted with headers

  // STEPS:
  // 1. Connect to Gmail API
  // 2. Fetch emails from inbox (minimum 100 per request)
  // 3. Filter based on read status if needed
  // 4. Sort by date-time (newest first)
  // 5. Limit to ${numberOfEmails} results
  // 6. Format as markdown table
  // 7. Return the formatted results
  //     `,
  //     toolkitNames,
  //   );

  //   this.logger.endSpan();
  // }

  // async summarizeInboxToSlack(slackUser: string) {
  //   const toolkitNames = ["gmail", "slack"];

  //   this.logger.startSpan(`Summarizing inbox to Slack...`);

  //   if (slackUser.startsWith("@")) {
  //     slackUser = slackUser.replace("@", "");
  //   }

  //   const stream = await this.run(
  //     `
  // TASK: Summarize unread emails and send to Slack user

  // REQUIREMENTS:
  // - Read all unread emails from my inbox
  // - Create a comprehensive summary of the email content
  // - Send the summary to Slack user: ${slackUser}
  // - Format the summary as a codeblock containing a markdown table for Slack messaging

  // STEPS:
  // 1. Connect to Gmail API and retrieve all unread emails
  // 2. Analyze email content and extract key information
  // 3. Create a clear, concise summary covering all important points
  // 4. Format the summary as a codeblock containing a markdown table for Slack messaging
  // 5. Send the summary to ${slackUser} via Slack
  // 6. Confirm successful delivery

  // OUTPUT FORMAT:
  // - Clear, professional summary
  // - Include key details from each email
  // - Format as a codeblock containing a markdown table for Slack messaging
  // - Ensure the message is properly formatted for Slack codeblock syntax
  //     `,
  //     toolkitNames,
  //   );

  //   this.logger.endSpan();
  // }
}
