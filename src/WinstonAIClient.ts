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
        return JSON.stringify(result, null, 2);
      }

      const global_similarity_score = result.similarity_score;
      const first_text_similarity_score = result.first_text.similarity_percentage;
      const second_text_similarity_score =
        result.second_text.similarity_percentage;

        let response: string = `The similarity score between the two texts is ${global_similarity_score}%. The first text is ${first_text_similarity_score}% similar to the second text. The second text is ${second_text_similarity_score}% similar to the first text.`;

        response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);
  
        return response;
    }
  
    public assemblePlagiarismResponse(r: PlagiarismDetectionResponse | IResponseError): string {
      if ('error' in r || !r.result) {
        return JSON.stringify(r, null, 2);
      }
  
      const result = r.result;
      
      const globalScore = result.score;
  
        let response: string = `The plagiarism detection tool Winston AI has detected the text as ${globalScore}% plagiarism.`;

        let sources = r.sources
        .filter((source) => source.canAccess)
        .slice(0, 2)
        .map((source) => {
          return `"""${source.url}""" with a plagiarism score of ${source.score}% plagiarism`;
        });
        
        if (sources.length > 0) {
          response += ` The main plagiarized sources are ${sources.join(", ")}`;
        }

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
          credits_used: r.credits_used,
          credits_remaining: r.credits_remaining,
        }

        response += "\n\n API Response : \n\n" + JSON.stringify(customResponse, null, 2);
        
        return response;
    }
  
    public assembleAiTextDetectorResponse(result: AiTextDetectorResponse | IResponseError): string {
      if ('error' in result || !result.score) {
        return JSON.stringify(result, null, 2);
  
      }
  
      const humanScore = result.score;
      const aiScore = 100 - humanScore;

        let response: string = `The AI detector Winston AI has detected the text as ${humanScore}% human-written. Which means that the text is ${aiScore}% likely to be written by an AI.`;

        // Return the 2 most AI sentences
        const ss = result.sentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((s) => {
          return `"""${s.text}""" with a score of ${s.score}%`;
        });
        
        if (ss.length > 0) {
          response += `The most AI sentences are ${ss.join(", ")}.`;
        }

        response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);
        
        return response;
    }
  
    public assembleAiImageDetectorResponse(result: AiImageDetectorResponse | IResponseError): string {
      if ('error' in result || !result.human_probability) {
        return JSON.stringify(result, null, 2);
      }


      // Keep only 2 decimals
      const humanPercentage = Number((result.human_probability * 100).toFixed(2));
      const aiPercentage = Number((result.ai_probability * 100).toFixed(2));

      let response = `The AI detector Winston AI has detected the image as ${humanPercentage}% human. Which means that the image is ${aiPercentage}% likely to be AI generated.`;

      response += "\n\n Full API Response : \n\n" + JSON.stringify(result, null, 2);

      return response;
    }
  }

