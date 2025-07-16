#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import 'dotenv/config'
import { WinstonAiClient } from "./WinstonAIClient";

import type {
  AiImageDetectorRequest,
  AiImageDetectorResponse,
  AiTextDetectorRequest,
  AiTextDetectorResponse,
  PlagiarismDetectionRequest,
  PlagiarismDetectionResponse,
  TextCompareRequest,
  TextCompareResponse,
} from "./type.d";

// Environment variables
const WINSTONAI_API_KEY = process.env.WINSTONAI_API_KEY
  ? process.env.WINSTONAI_API_KEY
  : "";

if (!WINSTONAI_API_KEY) {
  console.error("WINSTONAI_API_KEY is not set");
  process.exit(1);
}


const server = new McpServer({
  name: "Winston AI MCP Server",
  version: "1.0.0",
  description:
    "Model Context Protocol (MCP) Server for Winston AI - the most accurate AI Detector. Detect AI-generated content, plagiarism, and compare texts with ease.",
});

// Init WinstonAI Client
const winstonAIClient = new WinstonAiClient(WINSTONAI_API_KEY);

// Register AI text detection tool
server.registerTool(
  "ai-text-detection",
  {
    title: "AI Text Detection",
    description: "Detects AI content in a given text to detect the likelihood of the text being written by an AI.",
    annotations: {
      price: {
        type: "number",
        description: "The price of the text detection tool, 1 credit per word",
        value: 1,
        unit: "credits",
      }
    },
    inputSchema: {
      text: z
        .string()
        .min(300, "The text must be at least 300 characters long.")
        .max(150000, "The text must be less than 150 000 characters long.")
        .describe(
          "The text to scan. Texts under 600 characters may produce unreliable results and should be avoided. Maximum 150 000 characters per request.",
        ),
      file: z.string().optional().describe("A file to scan. If you supply a file, the API will scan the content of the file. The file must be in plain .pdf, .doc or .docx format. The file has priority over the text, so if you give a text and a file, it's the file that will be scanned."),
      website: z.string().optional().describe("A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible. It's important to know that the website has priority over the text and the file, so if you give a text, a file and a website, it's the website that will be scanned."),
    },
  },
  async ({ text, file, website }: AiTextDetectorRequest) => {
    if (winstonAIClient.isApiKeyInvalid()) {
      return {
        content: [
          {
            type: "text",
            text: "The API key is required to use the Winston AI text detection tool. Please provide the API key for the Winston AI API. Ask the user to provide his Winston AI API key.",
          },
        ],
      };
    }

    try {
      const result = await winstonAIClient.request<AiTextDetectorResponse>(
        "/v2/ai-content-detection",
        JSON.stringify({
          text,
          file,
          website,
          sentences: true,
          version: "latest",
          language: "auto",
        }),
      );

      return {
        content: [{ type: "text", text: winstonAIClient.assembleAiTextDetectorResponse(result) }],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "There was an error while detecting the AI content in the text. Make sure your text is longuer than 300 characters and it is in a supported language. We currently support English, French, Spanish, German, Italian, Portuguese, Dutch, Tagalog, Italian, Polish and Indonesian.",
          },
        ],
      };
    }
  },
);

// Register AI image detection tool
server.registerTool(
  "ai-image-detection",
  {
    title: "AI Image Detection",
    description: "Detects AI content in a given image by verifying image metada and using a machine learning system trained to differentiate between human and AI-generated images.",
    annotations: {
      price: {
        type: "number",
        description: "The price of the image detection tool, 300 credits per image",
        value: 300,
        unit: "credits",
      },
    },
    inputSchema: {
      url: z
        .string()
        .url()
        .describe(
          "Specifies the URL of the image to scan. The URL must be valid, publicly accessible, and point to an image in one of the following formats: JPG, JPEG, PNG, or WEBP. The image must have a minimum resolution of 256x256 pixels.",
        ),
    },
  },
  async ({ url }: AiImageDetectorRequest) => {
    if (winstonAIClient.isApiKeyInvalid()) {
      return {
        content: [
          {
            type: "text",
            text: "The API key is required to use the WinstonAI AI image detection tool. Please provide the API key for the Winston AI API. Ask the user to provide his Winston AI API key.",
          },
        ],
      };
    }

    if (!url || url.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "The URL is required to use the AI image detection tool. Please provide the URL of the image to detect AI content in.",
          },
        ],
      };
    }

    try {
      const result = await winstonAIClient.request<AiImageDetectorResponse>(
        "/v2/image-detection",
        JSON.stringify({
          url,
          version: "latest",
        }),
      );

      return {
        content: [
          {
            type: "text",
            text: winstonAIClient.assembleAiImageDetectorResponse(result),
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is at least 256x256 pixels.",
          },
        ],
      };
    }
  },
);

// Register plagiarism tool
server.registerTool(
  "plagiarism-detection",
  {
    title: "Plagiarism Detection",
    description: "Winston AI’s plagiarism API is a powerful tool designed to check text for plagiarism by scouring the internet for similar content. It queries multiple websites and compares the input text with the content found on these websites. This can be particularly useful in academic settings, content creation, legal scenarios or any other situation where originality of content is required.",
    annotations: {
      price: {
        type: "number",
        description: "The price of the plagiarism detection tool, 2 credits per word",
        value: 2,
        unit: "credits",
      },
    },
    inputSchema: {
      text: z
        .string()
        .min(100, "The text must be at least 100 characters long.")
        .max(120000)
        .describe(
          "The text to be scanned. This is required unless you provide a website or file. Each request must contain at least 100 characters and no more than 120,000 characters.",
        ),
      language: z
        .string()
        .optional()
        .describe(
          "2 letter language code. We accept all languages. Default: en.",
        )
        .default("en"),
      country: z
        .string()
        .optional()
        .describe(
          "The country code of the country where the text was written. We accept all country codes. Default: us.",
        )
        .default("us"),
    },
  },
  async ({ text, language, country }: PlagiarismDetectionRequest) => {
    if (winstonAIClient.isApiKeyInvalid()) {
      return {
        content: [
          {
            type: "text",
            text: "The API key is required to use the WinstonAI plagiarism detection tool. Please provide the API key for the Winston AI API.",
          },
        ],
      };
    }

    if (!text || text.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "The text is required to use the plagiarism detection tool. Please provide the text to detect plagiarism in.",
          },
        ],
        error:
          "The text is required to use the plagiarism detection tool. Please provide the text to detect plagiarism in.",
      };
    }

    try {

      const result = await winstonAIClient.request<PlagiarismDetectionResponse>(
        "/v2/plagiarism",
        JSON.stringify({
          text,
          language,
          country,
        }),
      );

      return {
        content: [{ type: "text", text: winstonAIClient.assemblePlagiarismResponse(result) }],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "There was an error while detecting the plagiarism in the text, please try again.",
          },
        ],
      };
    }
  },
);

// Register the text-compare tool
server.registerTool(
  "text-compare",
  {
    title: "Text Compare",
    description: "Compares two texts and returns the similarity score",
    annotations: {
      price: {
        type: "number",
        description: "The price of the text comparison tool, 1/2 credit per total words found in both texts",
        value: 0.5,
        unit: "credits",
      },
    },
    inputSchema: {
      first_text: z
        .string()
        .max(120000)
        .describe("The first text to compare. Maximum 120,000 characters."),
      second_text: z
        .string()
        .max(120000)
        .describe(
          "The second text to compare against the first text. Maximum 120,000 characters.",
        ),
    },
  },
  async ({ first_text, second_text }: TextCompareRequest) => {
    if (winstonAIClient.isApiKeyInvalid()) {
      return {
        content: [
          {
            type: "text",
            text: "The API key is required to use the WinstonAI text comparison tool. Please provide the API key for the Winston AI API.",
          },
        ],
      };
    }

    if (!first_text || first_text.length === 0 || !second_text || second_text.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "The first text is required to use the text comparison tool. Please provide the first text to compare.",
          },
        ],
      };
    }

    const result = await winstonAIClient.request<TextCompareResponse>(
      "/v2/text-compare",
      JSON.stringify({
        first_text,
        second_text,
      }),
    );
 
    return {
      content: [{ type: "text", text: winstonAIClient.assembleTextCompareResponse(result) }],
    };
  },
);

async function startServer() {
  const transport = new StdioServerTransport();
  await server
    .connect(transport);
}

startServer().catch((error) => {
  console.error("Failed to start Winston AI MCP Server:", error);
  process.exit(1);
});
