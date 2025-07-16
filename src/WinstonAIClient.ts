import axios from "axios";
import type {
    AiImageDetectorResponse,
    AiTextDetectorResponse,
    IResponseError,
    PlagiarismDetectionResponse,
    TextCompareResponse,
} from "./type";

const WINSTONAI_BASE_API_URL = "https://api.gowinston.ai";

export class WinstonAiClient {

    private readonly apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
      public isApiKeyInvalid(): boolean {
          return !this.apiKey || this.apiKey.length === 0 || this.apiKey.toLowerCase().includes("api");
      }
  
    public async request<T>(route: string, body: string): Promise<T> {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${WINSTONAI_BASE_API_URL}${route}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        data: body,
      };
  
      const request = await axios.request(config);
  
      return request.data as T;
    }
  
    public assembleTextCompareResponse(result: TextCompareResponse | IResponseError): string {
      if ('error' in result || !result.similarity_score) {
        return "There was an error while detecting the similarity between the two texts, please try again.";
      }

      const global_similarity_score = result.similarity_score;
      const first_text_similarity_score = result.first_text.similarity_percentage;
      const second_text_similarity_score =
        result.second_text.similarity_percentage;

        let response: string = "";

        response += `The similarity score between the two texts is ${global_similarity_score}%. The first text is ${first_text_similarity_score}% similar to the second text. The second text is ${second_text_similarity_score}% similar to the first text.`;

        response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);
  
        return response;
    }
  
    public assemblePlagiarismResponse(r: PlagiarismDetectionResponse | IResponseError): string {
      if ('error' in r || !r.result) {
        return "There was an error while detecting the plagiarism in the text, please try again.";
      }
  
      const result = r.result;
      
      const globalScore = result.score;
  
      const sources = r.sources
        .filter((source) => source.canAccess)
        .slice(0, 4)
        .map((source) => {
          return `${source.url} with a plagiarism score of ${source.score}% plagiarism`;
        });

        let response: string = "";
  
        response += `The plagiarism detection tool Winston AI has detected the text as ${globalScore}% plagiarism. The main sources are ${sources.join(", ")}.`;

        // Return all the sources in the customResponse, but dont return the plagiarismFound object
        const sourcesWithoutPlagiarism = r.sources.map((source) => {
          const customSource = source;

          delete customSource.plagiarismFound;

          return customSource;
        });

        const customResponse = {
          status: r.status,
          scanInformation: r.scanInformation,
          result: r.result,
          sources: sourcesWithoutPlagiarism,
          citations: r.citations,
        }

        response += "\n\n API Response : \n\n" + JSON.stringify(customResponse, null, 2);
        
        return response;
    }
  
    public assembleAiTextDetectorResponse(result: AiTextDetectorResponse | IResponseError): string {
      if ('error' in result || !result.score) {
        return "There was an error while detecting the AI content in the text. Make sure your text is longuer than 300 characters and it is in a supported language. We currently support English, French, Spanish, German, Italian, Portuguese, Dutch, Tagalog, Italian, Polish and Indonesian.";
  
      }
  
      const humanScore = result.score;
      const aiScore = 100 - humanScore;
  
      // Return the 4 most AI sentences
      const ss = result.sentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((s) => {
          return `The sentence ${s.text} has a score of ${s.score}.`;
        });

        let response: string = "";
  
        response += `The AI detector Winston AI has detected the text as ${humanScore}% human-written. Which means that the text is ${aiScore}% likely to be written by an AI. The most AI sentences are ${ss.join(", ")}.`;

        response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);
        
        return response;
    }
  
    public assembleAiImageDetectorResponse(result: AiImageDetectorResponse | IResponseError): string {
      if ('error' in result || !result.human_probability) {
        return "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is at least 256x256 pixels.";
      }

      let response: string = "";

      // Keep only 2 decimals
      const humanPercentage = Math.round(result.human_probability * 100 * 100) / 100;
      const aiPercentage = Math.round(result.ai_probability * 100 * 100) / 100;

      response += `The AI detector Winston AI has detected the image as ${humanPercentage}% human-written. Which means that the image is ${aiPercentage}% likely to be written by an AI.`;

      response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);

      return response;
    }
  }

