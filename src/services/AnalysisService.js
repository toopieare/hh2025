import { symptomPatterns } from '../models/SymptomPatterns';
import { clinicalConditions } from '../models/ClinicalConditions';

class AnalysisService {
  // Analyze a response for symptoms
  analyzeResponse(response, symptomType) {
    const pattern = symptomPatterns[symptomType];
    const lowerResponse = response.toLowerCase();
    
    // Check for keywords
    const foundKeywords = [];
    pattern.keywords.forEach(keyword => {
      if (lowerResponse.includes(keyword)) {
        foundKeywords.push({
          keyword: keyword,
          index: lowerResponse.indexOf(keyword)
        });
      }
    });
    
    // If no keywords found, no symptoms
    if (foundKeywords.length === 0) {
      return false;
    }
    
    // Check for negation words near keywords with improved proximity detection
    const hasNegation = pattern.negationWords.some(word => {
      if (lowerResponse.includes(word)) {
        // Get all occurrences of negation word
        let negationIndex = lowerResponse.indexOf(word);
        while (negationIndex !== -1) {
          // Check if any keyword is within proximity
          const isNearKeyword = foundKeywords.some(keywordInfo => {
            return Math.abs(keywordInfo.index - negationIndex) < 15; // Increased proximity range
          });
          
          if (isNearKeyword) {
            return true;
          }
          
          // Check for next occurrence
          negationIndex = lowerResponse.indexOf(word, negationIndex + 1);
        }
      }
      return false;
    });
    
    // Additional common negation phrases that might not be covered by simple word matching
    const commonNegations = [
      "did not", "didn't", "has not", "hasn't", "does not", "doesn't",
      "no falls", "no history", "not had", "never had"
    ];
    
    const hasCommonNegation = commonNegations.some(phrase => 
      lowerResponse.includes(phrase)
    );
    
    // If we have a keyword but it's negated, not a positive finding
    return !(hasNegation || hasCommonNegation);
  }

  // Generate a summary using zero-shot prompting
  async generateSummaryWithZeroShot(responses) {
    try {
      // Use a clinical geriatrician prompt that focuses on professional assessment
      const promptParts = [
        "You are a geriatrician. Your task is to draft a summary of the fall and cognitive history of the patient for the purpose of diagnosis and to inform further medical intervention.",
        "\nYou have interviewed the caregiver of the elderly patient and here is the complete fall and cognitive history that you have collected through the comprehensive geriatric assessment:",
        "\n\nPATIENT HISTORY (Q&A SESSION):\n"
      ];

      // Add all Q&A pairs to the prompt
      Object.entries(responses).forEach(([question, response]) => {
        promptParts.push(`Q: ${question}\nA: ${response}\n`);
      });

      // Analyze the responses to add structured data as context
      const detectedSymptoms = this.detectSymptoms(responses);
      const fallsConcern = detectedSymptoms.falls ? true : false;
      const cognitiveIssues = this.identifyCognitiveIssues(detectedSymptoms);

      // Add clinical context to guide the assessment
      promptParts.push("\nCLINICAL ANALYSIS:");
      promptParts.push(`Falls detected: ${fallsConcern ? "Yes - Patient had falls in the past few weeks" : "No"}`);
      
      // Emphasize the need to check the raw Q&A, not just rely on the detection flags
      promptParts.push("\nATTENTION: Please carefully review the patient responses about falls, particularly looking for any indications of recent falls in the past weeks or months, even if subtle or indirectly mentioned. Do not rely solely on the detection flags above.");
      
      // List specific cognitive conditions for clinical assessment
      promptParts.push("Potential cognitive conditions detected:");
      if (cognitiveIssues.length > 0) {
        cognitiveIssues.forEach(issue => {
          promptParts.push(`- ${issue}`);
        });
      } else {
        promptParts.push("- None identified");
      }
      
      // Provide specific clinical instruction for the summary format
      promptParts.push("\n\nINSTRUCTIONS:");
      promptParts.push("Summarise the key findings for fall and cognitive functions such as Amnesia, Agnosia, Apraxia, Aphasia and the elderly's executive function.");
      promptParts.push("\nFormat your assessment as follows:");
      promptParts.push("1. Falls history: [Concern/No concern with clinical justification]");
      promptParts.push("2. Cognitive history: [List specific detected conditions or 'No concerns identified']");
      promptParts.push("3. Be precise and use clinical terminology appropriate for a medical record.");
      
      const prompt = promptParts.join("\n");
      
      // In a real implementation, you would call an API to an LLM here
      // For now, we'll use our existing logic but structure it as if it came from the LLM
      const summary = await this.callLLMApi(prompt, detectedSymptoms, cognitiveIssues);
      return summary;
    } catch (error) {
      console.error("Error generating summary with zero-shot prompting:", error);
      // Fallback to the rule-based summary
      return this.generateRuleBasedSummary(responses);
    }
  }
  
  // OpenAI API integration with support for both development and production environments
  async callLLMApi(prompt, detectedSymptoms, cognitiveIssues) {
    try {
      let response;
      
      // Check if we're in development or production mode
      if (process.env.NODE_ENV === 'development') {
        // Development mode: Direct API call with key from .env
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        
        if (!apiKey) {
          console.error("OpenAI API key not found in environment variables");
          throw new Error("API key not configured");
        }

        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // You can also use "gpt-4" for more advanced reasoning
            messages: [
              {
                role: "system",
                content: "You are a geriatrician providing a professional assessment. Your task is to summarize the fall and cognitive history of patients, focusing on clinical findings related to Amnesia, Agnosia, Apraxia, Aphasia, and executive function. Use precise medical terminology appropriate for clinical documentation."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3, // Lower temperature for more focused, deterministic responses
            max_tokens: 500
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } else {
        // Production mode: Use our server-side proxy
        response = await fetch('/api/openai/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API proxy error:", errorData);
          throw new Error(`API proxy error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.summary;
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      // Fall back to rule-based generation if API call fails
      return this.generateFallbackSummary(detectedSymptoms, cognitiveIssues);
    }
  }
  
  // Fallback summary if API call fails
  generateFallbackSummary(detectedSymptoms, cognitiveIssues) {
    const fallsStatus = detectedSymptoms.falls 
      ? "Concern - Patient reported recent falls in the responses"
      : "No concern - No falls reported in recent history";
    
    let cognitiveStatus;
    if (cognitiveIssues.length > 0) {
      cognitiveStatus = cognitiveIssues.join(", ");
      // Add explanations to cognitive issues
      if (cognitiveStatus.includes("Short term amnesia")) {
        cognitiveStatus = cognitiveStatus.replace(
          "Short term amnesia", 
          "Short term amnesia (difficulty remembering recent events)"
        );
      }
      if (cognitiveStatus.includes("Executive dysfunction")) {
        cognitiveStatus = cognitiveStatus.replace(
          "Executive dysfunction", 
          "Executive dysfunction (difficulty managing finances)"
        );
      }
    } else {
      cognitiveStatus = "No concerns identified";
    }
    
    return `Falls history: ${fallsStatus}\n\nCognitive history: ${cognitiveStatus}`;
  }
  
  // Helper method to detect symptoms from responses
  detectSymptoms(responses) {
    const detectedSymptoms = {};
    
    Object.entries(responses).forEach(([question, response]) => {
      Object.keys(symptomPatterns).forEach(symptomType => {
        if (this.analyzeResponse(response, symptomType)) {
          detectedSymptoms[symptomType] = true;
        }
      });
    });
    
    return detectedSymptoms;
  }
  
  // Helper method to identify cognitive issues based on detected symptoms
  identifyCognitiveIssues(detectedSymptoms) {
    const cognitiveIssues = [];
    
    Object.entries(clinicalConditions).forEach(([condition, requiredSymptoms]) => {
      const hasAllSymptoms = requiredSymptoms.every(symptom => detectedSymptoms[symptom]);
      if (hasAllSymptoms) {
        // Special case for executive dysfunction
        if (condition === "Executive dysfunction" && detectedSymptoms.executive) {
          cognitiveIssues.push("Executive dysfunction (complex finances)");
        } else {
          cognitiveIssues.push(condition);
        }
      }
    });
    
    return cognitiveIssues;
  }
  
  // The original rule-based summary generation as a fallback
  generateRuleBasedSummary(responses) {
    const detectedSymptoms = this.detectSymptoms(responses);
    
    // Generate falls assessment
    const fallsStatus = detectedSymptoms.falls ? "Concern" : "No concern";
    
    // Generate cognitive assessment
    const cognitiveIssues = this.identifyCognitiveIssues(detectedSymptoms);
    
    // Format the summary
    let summary = `Falls history: ${fallsStatus}\n\n`;
    
    if (cognitiveIssues.length > 0) {
      summary += `Cognitive history: ${cognitiveIssues.join(", ")}`;
    } else {
      summary += "Cognitive history: No concerns identified";
    }
    
    return summary;
  }
  
  // Public method to generate summary - this will try zero-shot first, then fall back
  async generateSummary(responses) {
    try {
      return await this.generateSummaryWithZeroShot(responses);
    } catch (error) {
      console.error("Error with zero-shot summary, falling back to rule-based:", error);
      return this.generateRuleBasedSummary(responses);
    }
  }
}

export default new AnalysisService();