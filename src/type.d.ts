/**
 * AI Text Detector Interface
 */
export interface AiTextDetectorRequest {
  text: string;
  file?: string;
  website?: string;
}

interface AIDetectorSentence {
  score: number;
  text: string;
}

export interface IResponseError {
  error: string;
}

export interface AiTextDetectorResponse {
  score: number;
  sentences: AIDetectorSentence[];
  language: string;
  version: string;
  credits_used: number;
  credits_remaining: number;
}

/**
 * AI Image Detector Interface
 */
export interface AiImageDetectorRequest {
  url: string;
}

export interface AiImageDetectorResponse {
  score: number;
  human_probability: number;
  ai_probability: number;
  version: string;
  mime_type: string;
  c2pa: object | null;
  exif: object | null;
  ai_watermark_detected: boolean;
  ai_watermark_issuers: string[];
  credits_used: number;
  credits_remaining: number;
}

/**
 * Plagiarism Detection Interface
 */
export interface PlagiarismDetectionRequest {
  text: string;
  language: string;
  country: string;
}

interface PlagiarismScanInformation {
  service: string;
  scanTime: string;
  inputType: string;
}

interface PlagiarismResult {
  score: number;
  sourceCounts: number;
  textWordCounts: number;
  totalPlagiarismWords: number;
  identicalWordCounts: number;
  similarWordCounts: number;
}


interface PlagiarismIndex {
    startIndex: number;
    endIndex: number;
    sequence: string;
  }

interface PlagiarismSource {
    score: number;
    canAccess: boolean;
    totalNumberOfWords: number;
    plagiarismWords: number;
    identicalWordCounts: number;
    similarWordCounts: number;
    url: string;
    author: string;
    description: string;
    title: string;
    publishedDate: string;
    source: string;
    citation: boolean;
    plagiarismFound: PlagiarismIndex[];
    is_excluded: boolean;
    similarWords: string[];
  }

export interface PlagiarismDetectionResponse {
  status: number;
  scanInformation: PlagiarismScanInformation;
  result: PlagiarismResult;
  sources: PlagiarismSource[];
  indexes: PlagiarismIndex[];
  citations: string[];
  credits_used: number;
  credits_remaining: number;
}

/**
 * Text Compare Interface
 */
export interface TextCompareRequest {
  first_text: string;
  second_text: string;
}

interface TextCompareItems {
  type: string;
  word_count: number;
  index_start: number;
  length: number;
}

interface TextCompareItem {
  total_word_count: number;
  matching_word_count: number;
  similarity_percentage: number;
  items: TextCompareItems[];
}

export interface TextCompareResponse {
  status: number;
  similarity_score: number;
  first_text: TextCompareItem;
  second_text: TextCompareItem;
  credits_used: number;
  credits_remaining: number;
}
