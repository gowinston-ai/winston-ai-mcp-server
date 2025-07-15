export interface AiTextDetectorRequest {
    text: string;
    api_key: string;
}

export interface AiTextDetectorResponse {
    score: number;
    sentences: {
        score: number;
        text: string;
    }[];
    language: string;
    version: string;
    credits_used: number;
    credits_remaining: number;
    error?: string;
}

export interface AiImageDetectorRequest {
    url: string;
    api_key: string;
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


export interface PlagiarismDetectionRequest {
    text: string;
    api_key: string;
    language: string;
    country: string;
}

export interface PlagiarismDetectionResponse {
    status: number;
    scanInformation: {
        service: string;
        scanTime: string;
        inputType: string;
    },
    result: {
        score: number;
        sourceCounts: number;
        textWordCounts: number;
        totalPlagiarismWords: number;
        identicalWordCounts: number;
        similarWordCounts: number;
    },
    sources: {
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
        plagiarismFound: {
            startIndex: number;
            endIndex: number;
            sequence: string;
        }[];
        is_excluded: boolean;
        similarWords: string[];
    }[];
    indexes: {
        startIndex: number;
        endIndex: number;
    }[];
    citations: string[];
    credits_used: number;
    credits_remaining: number;
}

export interface TextCompareRequest {
    text1: string;
    text2: string;
    api_key: string;
}

export interface TextCompareResponse {
    status: number;
    similarity_score: number;
    first_text: {
        total_word_count: number;
        matching_word_count: number;
        similarity_percentage: number;
        items: {
            type: string;
            word_count: number;
            index_start: number;
            length: number;
        }[]
    },
    second_text: {
        total_word_count: number;
        matching_word_count: number;
        similarity_percentage: number;
        items: {
            type: string;
            word_count: number;
            index_start: number;
            length: number;
        }[]
    },
    credits_used: number;
    credits_remaining: number;
}