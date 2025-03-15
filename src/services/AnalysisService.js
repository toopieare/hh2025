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
  
  // Generate a summary based on responses
  generateSummary(responses) {
    // Identify symptoms from responses
    const detectedSymptoms = {};
    
    // Analyze each response
    Object.entries(responses).forEach(([question, response]) => {
      // Analyze response for each symptom type
      Object.keys(symptomPatterns).forEach(symptomType => {
        if (this.analyzeResponse(response, symptomType)) {
          detectedSymptoms[symptomType] = true;
        }
      });
    });
    
    // Generate falls assessment
    const fallsStatus = detectedSymptoms.falls ? "Concern" : "No concern";
    
    // Generate cognitive assessment
    const cognitiveIssues = [];
    Object.entries(clinicalConditions).forEach(([condition, requiredSymptoms]) => {
      const hasAllSymptoms = requiredSymptoms.every(symptom => detectedSymptoms[symptom]);
      if (hasAllSymptoms) {
        cognitiveIssues.push(condition);
      }
    });
    
    // Add special handling for complex finances
    if (detectedSymptoms.executive) {
      const executiveIndex = cognitiveIssues.indexOf("Executive dysfunction");
      if (executiveIndex !== -1) {
        cognitiveIssues[executiveIndex] = "Executive dysfunction (complex finances)";
      }
    }
    
    // Format the summary
    let summary = `Falls history: ${fallsStatus}\n\n`;
    
    if (cognitiveIssues.length > 0) {
      summary += `Cognitive history: ${cognitiveIssues.join(", ")}`;
    } else {
      summary += "Cognitive history: No concerns identified";
    }
    
    return summary;
  }
}

export default new AnalysisService();