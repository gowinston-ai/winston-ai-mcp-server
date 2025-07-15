import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

import { AiImageDetectorRequest, AiImageDetectorResponse, AiTextDetectorRequest, AiTextDetectorResponse, PlagiarismDetectionRequest, PlagiarismDetectionResponse, TextCompareRequest, TextCompareResponse } from "./type";

const AI_DETECTOR_API_BASE = "https://api.gowinston.ai";

const server = new McpServer({
    name: "AIdetector",
    version: "1.0.0",
    description: "A WinstonAI MCP server that detects AI generated text"
});

// Register AI text detection tool
server.registerTool(
    "ai-text-detection",
    {
        title: "AI Text Detection",
        description: "Detects AI content in a given text",
        inputSchema: { text: z.string().describe("The text to detect AI content in"), api_key: z.string().describe("The API key to use for the AI detection") },
    },
    async ({ text, api_key }: AiTextDetectorRequest) => {

        if (!api_key || api_key.length === 0 || api_key.toLowerCase().includes("api")) {
            return {
                content: [{ type: "text", text: "The API key is required to use the WinstonAI AI text detection tool. Please provide the API key for the Winston AI API. Ask the user to provide his Winston AI API key." }],
                error: "The API key is required to use the WinstonAI AI text detection tool. Please provide the API key for the Winston AI API. Ask the user to provide his Winston AI API key."
            };
        }

        try {
            const b = JSON.stringify({
                text,
            });

            let c = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${AI_DETECTOR_API_BASE}/v2/ai-content-detection`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
                data: b
            };

            const request = await axios.request(c);
            const d: AiTextDetectorResponse = request.data;

            if (d.error || !d.score) {
                return {
                    content: [{ type: "text", text: "There was an error while detecting the AI content in the text. Make sure your text is longuer than 300 characters and it is in a supported language." }],
                    error: "There was an error while detecting the AI content in the text. Make sure your text is longuer than 300 characters and it is in a supported language."
                };
            }

            const humanScore = d.score;
            const aiScore = 100 - humanScore;


            // Return the 3 most AI sentences
            const ss = d.sentences.sort((a, b) => b.score - a.score).slice(0, 3).map((sentence, index) => {
                return `The sentence ${index + 1} is ${sentence.text} and the AI score is ${sentence.score}.`;
            });


            const response = `The AI detector WinstonAI has detected the text as ${humanScore}% human-written. Which means that the text is ${aiScore}% likely to be written by an AI. The most AI sentences are ${ss.join(", ")}.`;

            return {
                content: [{ type: "text", text: response }]
            };

        } catch (error) {
            return {
                content: [{ type: "text", text: "There was an error while detecting the AI content in the text. Please provide a valid API KEY, a valid text and make sure your text is longuer than 300 characters and it is in a supported language." }],
                error: "There was an error while detecting the AI content in the text. Please provide a valid API KEY, a valid text and make sure your text is longuer than 300 characters and it is in a supported language."
            };
        }


    }
);

// Register AI image detection tool
server.registerTool(
    "ai-image-detection",
    {
        title: "AI Image Detection",
        description: "Detects AI content in a given image",
        inputSchema: { url: z.string().describe("The URL of the image to detect AI content in"), api_key: z.string().describe("The API key to use for the AI image detection") },
    },
    async ({ url, api_key }: AiImageDetectorRequest) => {

        if (!api_key || api_key.length === 0 || api_key.startsWith("your_api_key")) {

            return {
                content: [{ type: "text", text: "The API key is required to use the WinstonAI AI image detection tool. Please provide the API key for the Winston AI API. Ask the user to provide his Winston AI API key." }],
                error: "The API key is required to use the WinstonAI AI image detection tool. Please provide the API key for the Winston AI API."
            };
        }

        if (!url || url.length === 0) {
            return {
                content: [{ type: "text", text: "The URL is required to use the AI image detection tool. Please provide the URL of the image to detect AI content in." }],
                error: "The URL is required to use the AI image detection tool. Please provide the URL of the image to detect AI content in."
            };
        }

        try {
            const d = JSON.stringify({
                url
            });
    
            let c = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${AI_DETECTOR_API_BASE}/v2/ai-image-detection`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
                data: d
            };
    
            const request = await axios.request(c);
            const response: AiImageDetectorResponse = request.data;

            if (!response.human_probability) {
                return {
                    content: [{ type: "text", text: "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is at least 256x256 pixels." }],
                    error: "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is at least 256x256 pixels."
                };
            }
    
            const humanScore = response.human_probability * 100;
    
            return {
                content: [{ type: "text", text: `The AI image detector WinstonAI has detected the image as ${humanScore}% likely to be written by an AI.` }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is not too large." }],
                error: "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is not too large."
            };
        }


    }
);


// Register plagiarism tool
server.registerTool(
    "plagiarism-detection",
    {
        title: "Plagiarism Detection",
        description: "Detects plagiarism in a given text",
        inputSchema: { text: z.string().describe("The text to detect plagiarism in"), api_key: z.string().describe("The API key to use for the plagiarism detection"), language: z.string().describe("The language of the text").default("en"), country: z.string().describe("The country of the text").default("us") },
    },
    async ({ text, api_key, language, country }: PlagiarismDetectionRequest) => {

        if (!api_key || api_key.length === 0 || api_key.startsWith("your_api_key")) {
            return {
                content: [{ type: "text", text: "The API key is required to use the WinstonAI plagiarism detection tool. Please provide the API key for the Winston AI API." }],
                error: "The API key is required to use the WinstonAI plagiarism detection tool. Please provide the API key for the Winston AI API."
            };
        }

        if (!text || text.length === 0) {

            return {
                content: [{ type: "text", text: "The text is required to use the plagiarism detection tool. Please provide the text to detect plagiarism in." }],
                error: "The text is required to use the plagiarism detection tool. Please provide the text to detect plagiarism in."
            };
        }

        try {
            const data = JSON.stringify({
                text,
                language,
                country
            });
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${AI_DETECTOR_API_BASE}/v2/plagiarism`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
                data: data
            };
    
            const req = await axios.request(config)
    
            const d: PlagiarismDetectionResponse = req.data;

            if (!d.result.score) {
                return {
                    content: [{ type: "text", text: "There was an error while detecting the plagiarism in the text." }],
                    error: "There was an error while detecting the plagiarism in the text."
                };
            }
    
            const globalScore = d.result.score;
    
            const sources = d.sources.filter((source) => source.canAccess).slice(0, 4).map((source, index) => {
                return `The source ${index + 1} is ${source.url} and the plagiarism score is ${source.score}.`;
            });
    
            const response = `The plagiarism detection tool WinstonAI has detected the text as ${globalScore}%. The main sources are ${sources.join(", ")}.`;
    
            return {
                content: [{ type: "text", text: response }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: "There was an error while detecting the plagiarism in the text." }],
                error: "There was an error while detecting the plagiarism in the text."
            };
        }
    }
);

// Register the text-compare tool
server.registerTool(
    "text-compare",
    {
        title: "Text Compare",
        description: "Compares two texts and returns the similarity score",
        inputSchema: { text1: z.string().describe("The first text to compare"), text2: z.string().describe("The second text to compare"), api_key: z.string().describe("The API key to use for the text comparison") },
    },
    async ({ text1, text2, api_key }: TextCompareRequest) => {

        if (!api_key || api_key.length === 0 || api_key.startsWith("your_api_key")) {
            return {
                content: [{ type: "text", text: "The API key is required to use the WinstonAI text comparison tool. Please provide the API key for the Winston AI API." }],
                error: "The API key is required to use the WinstonAI text comparison tool. Please provide the API key for the Winston AI API."
            };
        }

        if (!text1 || text1.length === 0 || !text2 || text2.length === 0) {

            return {
                content: [{ type: "text", text: "The first text is required to use the text comparison tool. Please provide the first text to compare." }],
                error: "The first text is required to use the text comparison tool. Please provide the first text to compare."
            };
        }

        const b = JSON.stringify({
            "first_text": text1,
            "second_text": text2,
        });

        let c = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${AI_DETECTOR_API_BASE}/v2/text-compare`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            data: b
        };

        const request = await axios.request(c);

        const d: TextCompareResponse = request.data;

        const global_similarity_score = d.similarity_score;
        const first_text_similarity_score = d.first_text.similarity_percentage;
        const second_text_similarity_score = d.second_text.similarity_percentage;

        const response = `The similarity score between the two texts is ${global_similarity_score}%. The first text is ${first_text_similarity_score}% similar to the second text. The second text is ${second_text_similarity_score}% similar to the first text.`;

        return {
            content: [{ type: "text", text: response }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Server failed to start");
}

main().catch(console.error);

