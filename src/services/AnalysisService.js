import { symptomPatterns } from '../models/SymptomPatterns';
import { clinicalConditions } from '../models/ClinicalConditions';

class AnalysisService {
  // Analyze a response for symptoms
  analyzeResponse(response, symptomType) {
    const pattern = symptomPatterns[symptomType];
    const lowerResponse = response.toLowerCase();
    
    // Check for keywords
    const hasKeyword = pattern.keywords.some(keyword => lowerResponse.includes(keyword));
    
    // Check for negation words near keywords
    const hasNegation = pattern.negationWords.some(word => {
      if (lowerResponse.includes(word)) {
        // Simple proximity check
        const negationIndex = lowerResponse.indexOf(word);
        return pattern.keywords.some(keyword => {
          const keywordIndex = lowerResponse.indexOf(keyword);
          return keywordIndex !== -1 && Math.abs(keywordIndex - negationIndex) < 10;
        });
      }
      return false;
    });
    
    // If we have a keyword but no nearby negation, consider it a positive finding
    return hasKeyword && !hasNegation;
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