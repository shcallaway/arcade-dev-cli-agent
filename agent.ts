#!/usr/bin/env bun

import { program } from "@commander-js/extra-typings";
import * as pkg from "./package.json";
import { Config } from "./classes/config";
import { Logger } from "./classes/logger";

import { InboxAgent } from "./agents/inbox";
import { setOpenAIClient } from "./utils/client";

const config = new Config();
const logger = new Logger(config);
setOpenAIClient(config);

program.version(pkg.version).name(pkg.name).description(pkg.description);

program
  .command("inbox")
  .description("Read your inbox and summarize the emails")
  .option(
    "-n, --number_of_emails <number_of_emails>",
    "The number of emails to read",
    parseInt,
    10,
  )
  .action(async (options) => {
    const agent = new InboxAgent(config, logger);
    await agent.readInbox(options.number_of_emails);
    process.exit(0);
  });

program
  .command("slack-summary")
  .description("Read your inbox and summarize the emails")
  .argument("<slack_user>", "The slack user to send the summary to")
  .action(async (slack_user) => {
    const agent = new InboxAgent(config, logger);
    await agent.summarizeInboxToSlack(slack_user);
    process.exit(0);
  });

program.parse();
