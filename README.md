# Arcade Email Agent Template

## Prerequisites

- Bun installed on your computer - https://bun.com/docs/installation
- An OpenAI API Key - https://openai.com/
- An Arcade.dev API key - https://www.arcade.dev/

## This Repo

To install dependencies:

```bash
bun install
```

Then, set up the environment variables you will need:

```bash
cp .env.example .env
# fill it out with your information!
```

To run:

```bash
./agent.ts
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Notes

- **Why Bun and TS?**: When thinking about this demo, we knew that the audience is engineers, but we don't know much else about them. JS is the most popular programming language, and type-safety is helpful in IDEs when learning. Bun is a bit of a wildcard, because it's new and less popular than node.js, but it solves all of the TS/compiler problems... which I think will make it easier for folks to get started on the demo.
