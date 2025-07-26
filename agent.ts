#!/usr/bin/env bun

import { program } from "@commander-js/extra-typings";
import * as pkg from "./package.json";
import { Config } from "./classes/config";
import { Logger } from "./classes/logger";
import * as readline from "readline";

import { setOpenAIClient } from "./utils/client";
import chalk from "chalk";

import { GeneralAgent } from "./agents/general";
import { InboxAgent } from "./agents/inbox";

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

program
  .command("chat")
  .description("Start an interactive chat session with the agent")
  .argument("[message]", "The message to start the chat session with")
  .option(
    "-t, --toolkits <toolkits>",
    "Comma-separated list of toolkits to use (e.g., gmail,slack)",
    "gmail,slack",
  )
  .action(async (message, options) => {
    const agent = new GeneralAgent(config, logger);
    const toolkitNames = options.toolkits.split(",").map((t) => t.trim());

    logger.info(
      `🤖 Starting chat session with your agent (${config.openai_model})`,
    );
    logger.info(`📦 Available toolkits: ${toolkitNames.join(", ")}`);
    logger.info("💡 Type 'quit', 'exit', or 'bye' to end the session");
    logger.info("💡 Type 'clear' to clear the conversation history");

    async function askQuestion(
      questionText: string = `${logger.getTimestamp()} ` + chalk.green("?>: "),
    ) {
      await new Promise((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question(questionText, async (answer) => {
          await handleInput(answer.trim());
          rl.close();
          resolve(true);
        });
      });

      await askQuestion();
    }

    async function handleInput(input: string) {
      if (input.toLowerCase() === "quit" || input.toLowerCase() === "exit") {
        console.log("👋 Goodbye!");
        process.exit(0);
      }

      if (input === "clear") {
        agent.history = [];
        logger.info("🧹 Conversation history cleared!");
        askQuestion();
        return;
      }

      return await agent.chat(input, toolkitNames);
    }

    if (message) {
      await handleInput(message);
    }
    await askQuestion();
  });

program.parse();
