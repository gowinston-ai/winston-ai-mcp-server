import { PlagiarismDetectionResponse } from "../src/type";
import { WinstonAiClient } from "../src/WinstonAIClient";


describe('Winston AI Client', () => {
    let winstonAIClient: WinstonAiClient;
    let winstonAIClientApiKey: string = "test_api_key_for_testing";

    const GENERATED_SAMPLE_TEXT = "Whales are some of the largest and most fascinating creatures on Earth. Belonging to the order Cetacea, these majestic marine mammals inhabit oceans all around the world."

    const AI_TEXT_DETECTION_VALID_RESPONE = {
        "status": 200,
        "length": 1223,
        "score": 65,
        "sentences": [
            {
                "length": 172,
                "score": 0.65,
                "text": GENERATED_SAMPLE_TEXT
            },
        ],
        "input": "text",
        "readability_score": 55.61,
        "credits_used": 195,
        "credits_remaining": 99999805,
        "version": "4.8",
        "language": "es"
    };

    const AI_IMAGE_DETECTION_VALID_RESPONSE = {
        "score": 99.94,
        "human_probability": 0.9994400143623352,
        "ai_probability": 0.0005599422147497535,
        "version": "2",
        "mime_type": "image/jpeg",
        "c2pa": null,
        "exif": null,
        "ai_watermark_detected": false,
        "ai_watermark_issuers": [],
        "credits_used": 300,
        "credits_remaining": 99999700
    };

    const PLAGIARISM_DETECTION_VALID_RESPONSE = {
        "status": 200,
        "scanInformation": {
            "service": "plagiarism",
            "scanTime": "2025-07-16T17:34:45.786Z",
            "inputType": "text"
        },
        "result": {
            "score": 71,
            "sourceCounts": 7,
            "textWordCounts": 161,
            "totalPlagiarismWords": 114,
            "identicalWordCounts": 114,
            "similarWordCounts": 0
        },
        "sources": [
            {
                "score": 71,
                "canAccess": true,
                "totalNumberOfWords": 161,
                "plagiarismWords": 114,
                "identicalWordCounts": 114,
                "similarWordCounts": 0,
                "url": "URL",
                "description": GENERATED_SAMPLE_TEXT,
                "title": GENERATED_SAMPLE_TEXT,
                "publishedDate": "unknown",
                "citation": false,
                "plagiarismFound": [
                    {
                        "startIndex": 238,
                        "endIndex": 350,
                        "sequence": GENERATED_SAMPLE_TEXT
                    },
                ],
                "is_excluded": false,
                "similarWords": []
            },
        ],
        "similarWords": [],
        "indexes": [
            {
                "startIndex": 238,
                "endIndex": 350
            },
            {
                "startIndex": 365,
                "endIndex": 502
            },
            {
                "startIndex": 559,
                "endIndex": 697
            },
            {
                "startIndex": 716,
                "endIndex": 847
            },
            {
                "startIndex": 872,
                "endIndex": 974
            },
            {
                "startIndex": 991,
                "endIndex": 1133
            }
        ],
        "citations": [],
    }

    const TEXT_COMPARE_VALID_RESPONSE = {
        "status": 200,
        "similarity_score": 100,
        "first_text": {
            "total_word_count": 186,
            "matching_word_count": 186,
            "similarity_percentage": 100,
            "items": [
                {
                    "type": "identical",
                    "word_count": 186,
                    "index_start": 0,
                    "length": 1287
                }
            ]
        },
        "second_text": {
            "total_word_count": 186,
            "matching_word_count": 186,
            "similarity_percentage": 100,
            "items": [
                {
                    "type": "identical",
                    "word_count": 186,
                    "index_start": 0,
                    "length": 1287
                }
            ]
        },
        "credits_used": 186,
        "credits_remaining": 99999814
    };

    const AI_CONTENT_DETECTION_EXPECTED_ERROR_MESSAGE = "There was an error while detecting the AI content in the text. Make sure your text is longuer than 300 characters and it is in a supported language. We currently support English, French, Spanish, German, Italian, Portuguese, Dutch, Tagalog, Italian, Polish and Indonesian.";
    const AI_IMAGE_DETECTION_EXPECTED_ERROR_MESSAGE = "There was an error while detecting the AI content in the image. Make sure the URL is valid and the image is at least 256x256 pixels.";
    const PLAGIARISM_DETECTION_EXPECTED_ERROR_MESSAGE = "There was an error while detecting the plagiarism in the text, please try again."
    const TEXT_COMPARE_EXPECTED_ERROR_MESSAGE = "There was an error while detecting the similarity between the two texts, please try again.";

    beforeEach(() => {
        winstonAIClient = new WinstonAiClient(winstonAIClientApiKey);
    });

    describe('assembleAiTextDetectorResponse', () => {

        describe('given a result with a error', () => {
            const errorResult = {
                error: "There was an error while detecting the AI content in the text.",
            }

            it('should return an error message', () => {
                const result = winstonAIClient.assembleAiTextDetectorResponse(errorResult);

                expect(result).toContain("\"error\": \"There was an error while detecting the AI content in the text.\"");
            });
        });

        describe('given a valid response', () => {

            let result: string;

            beforeEach(() => {
                result = winstonAIClient.assembleAiTextDetectorResponse(AI_TEXT_DETECTION_VALID_RESPONE);
            });


            it('then result sould contain the explanation text', () => {
                expect(result).toContain("The AI detector Winston AI has detected the text as 65% human-written. Which means that the text is 35% likely to be written by an AI.");
            });

            it('then result should contain the score', () => {
                expect(result).toContain("\"score\": 65");
            });

            it('then result should contain the sentences', () => {
                expect(result).toContain(GENERATED_SAMPLE_TEXT);
            });
        });
      
    });


    describe('assembleAiImageDetectorResponse', () => {

        describe('given a result with a error', () => {
            const errorResult = {
                error: "There was an error while detecting the AI content in the image.",
            }

            it('should return an error message', () => {
                const result = winstonAIClient.assembleAiImageDetectorResponse(errorResult);

                expect(result).toContain("\"error\": \"There was an error while detecting the AI content in the image.\"");
            });
        });

        describe('given a valid response', () => {
            let result: string;

            beforeEach(() => {
                result = winstonAIClient.assembleAiImageDetectorResponse(AI_IMAGE_DETECTION_VALID_RESPONSE);
            });

            it('then result should contain the explanation text', () => {
                expect(result).toContain("The AI detector Winston AI has detected the image as 99.94% human. Which means that the image is 0.06% likely to be AI generated.");
            });

            it('then result should contain the score', () => {  
                expect(result).toContain("\"score\": 99.94");
            });

            it('then result should contain the human probability', () => {
                expect(result).toContain("\"human_probability\": 0.9994400143623352");
            });

            it('then result should contain the ai probability', () => {
                expect(result).toContain("\"ai_probability\": 0.0005599422147497535");
            });

            it('then result should contain the version', () => {
                expect(result).toContain("\"version\": \"2\"");
            });
        });
    });

    describe('assemblePlagiarismResponse', () => {
        describe('given a result with a error', () => {
            const errorResult = {
                error: "There was an error while detecting the plagiarism in the text.",
            }

            it('should return an error message', () => {
                const result = winstonAIClient.assemblePlagiarismResponse(errorResult);

                expect(result).toContain("\"error\": \"There was an error while detecting the plagiarism in the text.\"");
            });
        });

        describe('given a valid response', () => {
            let result: string;

            beforeEach(() => {
                result = winstonAIClient.assemblePlagiarismResponse(PLAGIARISM_DETECTION_VALID_RESPONSE as unknown as PlagiarismDetectionResponse);
            });

            it('then result should contain the explanation text', () => {
                expect(result).toContain("The plagiarism detection tool Winston AI has detected the text as 71% plagiarism. The main plagiarized sources are \"\"\"URL\"\"\" with a plagiarism score of 71% plagiarism");
            });

            it('then result should contain the sources', () => {
                expect(result).toContain("\"\"\"URL\"\"\" with a plagiarism score of 71% plagiarism");
            });
            
            it('then result should contain the result object', () => {
                expect(result).toContain("\"result\": {");
            });

            it('then result should contain the sources object', () => {
                expect(result).toContain("\"sources\": [");
            });
            
            
        });
        
        
    });

    describe('assembleTextCompareResponse', () => {
        describe('given a result with a error', () => {
            const errorResult = {
                error: "There was an error while detecting the similarity between the two texts.",
            }

            it('should return an error message', () => {
                const result = winstonAIClient.assembleTextCompareResponse(errorResult);

                expect(result).toContain("\"error\": \"There was an error while detecting the similarity between the two texts.\"");
            });
        });

        describe('given a valid response', () => {
            let result: string;

            beforeEach(() => {
                result = winstonAIClient.assembleTextCompareResponse(TEXT_COMPARE_VALID_RESPONSE);
            });

            it('then result should contain the explanation text', () => {
                expect(result).toContain("The similarity score between the two texts is 100%. The first text is 100% similar to the second text. The second text is 100% similar to the first text.");
            });

            it('then result should contain the score', () => {  
                expect(result).toContain("\"similarity_score\": 100");
            });

            it('then result should contain the items object', () => {
                expect(result).toContain("\"items\": [");
            });
        });
    }); 

});