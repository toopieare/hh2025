import { assessmentQuestions } from '../models/QuestionBank';
import AnalysisService from './AnalysisService';

class AssessmentService {
  constructor() {
    this.responses = {};
    this.currentQuestionIndex = 0;
    this.isComplete = false;
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
      }
      
      return this.getCurrentQuestion();
    }
    
    return null;
  }
  
  // Get the assessment summary
  getSummary() {
    if (!this.isComplete) {
      return "Assessment is not complete yet.";
    }
    
    return AnalysisService.generateSummary(this.responses);
  }
  
  // Reset the assessment
  reset() {
    this.responses = {};
    this.currentQuestionIndex = 0;
    this.isComplete = false;
  }
  
  // Get all recorded responses
  getResponses() {
    return { ...this.responses };
  }
}

export default new AssessmentService();