#!/usr/bin/env bun

import { program } from "@commander-js/extra-typings";
import * as pkg from "./package.json";
import { Config } from "./classes/config";
import { Logger } from "./classes/logger";

import Arcade from '@arcadeai/arcadejs';
import { executeOrAuthorizeZodTool, toZod } from "@arcadeai/arcadejs/lib";
import { Agent, run, tool } from '@openai/agents';

import { InboxAgent } from "./agents/inbox";
import { prepareTools } from "./utils/tools";


const config = new Config();
const logger = new Logger(config);

program
  .version(pkg.version)
  .name(pkg.name)
  .description(pkg.description);

program
  .command("inbox")
  .description("Read your inbox and summarize the emails")
  .option(
    "-n, --number_of_emails [number_of_emails]",
    "The number of emails to read",
    parseInt,
    10
  )
  .action(async (options) => {
    // const agent = new InboxAgent(config, logger);
    // await agent.chat();
    // process.exit(0);

    const tools = await prepareTools(config, logger, "gmail");

    const googleAgent = new Agent({
      name: "Gmail agent",
      instructions: "You are a helpful assistant that can assist with Google API calls.",
      model: config.openai_model,
      tools: tools
    });

    logger.startSpan(`Analyzing inbox...`);
    const result = await run(googleAgent, "What are my latest 10 emails?  Format the response as a markdown table.");
    logger.info(result.finalOutput);
    logger.endSpan(`Done!`);

    process.exit(0);
  });

program.parse();

