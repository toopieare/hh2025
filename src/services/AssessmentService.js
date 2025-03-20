import { assessmentQuestions } from '../models/QuestionBank';
import AnalysisService from './AnalysisService';

class AssessmentService {
  constructor() {
    this.responses = {};
    this.currentQuestionIndex = 0;
    this.isComplete = false;
    this.cachedSummary = null;
  }
  
  // Get the current question
  getCurrentQuestion() {
    if (this.currentQuestionIndex < assessmentQuestions.length) {
      return assessmentQuestions[this.currentQuestionIndex];
    }
    return null;
  }
  
  // Record a response and advance to the next question
  recordResponse(response) {
    const currentQuestion = this.getCurrentQuestion();
    
    if (currentQuestion) {
      this.responses[currentQuestion] = response;
      this.currentQuestionIndex++;
      
      // Check if assessment is complete
      if (this.currentQuestionIndex >= assessmentQuestions.length) {
        this.isComplete = true;
        // Pre-generate summary when assessment is complete
        this.generateSummaryAsync();
      }
      
      return this.getCurrentQuestion();
    }
    
    return null;
  }
  
  // Generate summary asynchronously and cache it
  async generateSummaryAsync() {
    if (!this.isComplete) {
      return "Assessment is not complete yet.";
    }
    
    try {
      const summary = await AnalysisService.generateSummary(this.responses);
      this.cachedSummary = summary;
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      this.cachedSummary = "Error generating summary.";
      return this.cachedSummary;
    }
  }
  
  // Get the assessment summary - returns cached or generates new
  async getSummaryAsync() {
    if (this.cachedSummary) {
      return this.cachedSummary;
    }
    return this.generateSummaryAsync();
  }
  
  // Synchronous method for backward compatibility
  getSummary() {
    if (!this.isComplete) {
      return "Assessment is not complete yet.";
    }
    
    if (this.cachedSummary) {
      return this.cachedSummary;
    }
    
    // Return a placeholder if summary is still being generated
    return "Generating assessment summary...";
  }
  
  // Reset the assessment
  reset() {
    this.responses = {};
    this.currentQuestionIndex = 0;
    this.isComplete = false;
    this.cachedSummary = null;
  }
  
  // Get all recorded responses
  getResponses() {
    return { ...this.responses };
  }
}

export default new AssessmentService();