import { setDefaultOpenAIClient } from "@openai/agents-openai";
import { OpenAI } from "openai";

import type { Config } from "../classes/config";

export function setOpenAIClient(config: Config) {
  const client = new OpenAI({
    apiKey: config.openai_api_key,
  });

  setDefaultOpenAIClient(client);
}
