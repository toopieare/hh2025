import React, { useState, useEffect, useCallback } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';
import ResponseDisplay from '../components/ResponseDisplay';
import EnhancedSummaryDisplay from '../components/EnhancedSummaryDisplay';
import QADisplay from '../components/QADisplay';
import ThinkingIndicator from '../components/ThinkingIndicator';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import ResponseConfirmation from '../components/ResponseConfirmation';
import './ResponseConfirmation.css';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import AssessmentService from '../services/AssessmentService';
import { assessmentQuestions } from '../models/QuestionBank';
import './AssessmentContainer.css';

const AssessmentContainer = ({ patientName }) => {
  const [status, setStatus] = useState('idle'); // idle, speaking, listening, processing, thinking, complete
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [allResponses, setAllResponses] = useState({});
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pendingResponse, setPendingResponse] = useState('');
  const [confirmingResponse, setConfirmingResponse] = useState(false);
  
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { speak, speaking, cancel } = useSpeechSynthesis();
  
  // Create simple labels for the progress bar
  const progressLabels = assessmentQuestions.map((_, index) => `Q${index + 1}`);
  
  const startAssessment = useCallback(async () => {
    // Reset the assessment
    AssessmentService.reset();
    setStatus('starting');
    setLastResponse('');
    setSummary('');
    setAllResponses({});
    setShowAssessment(false);
    setCurrentQuestionIndex(0);
    
    // Introduction message
    try {
      await speak(`I'm going to ask you some questions about ${patientName}'s health. Please respond after each question.`);
      
      // Start with first question
      const firstQuestion = AssessmentService.getCurrentQuestion();
      setCurrentQuestion(firstQuestion);
      
      // Ask the first question
      await askQuestion(firstQuestion);
    } catch (error) {
      console.error('Error starting assessment:', error);
      setStatus('error');
    }
  }, [speak, patientName]);
  
  const askQuestion = useCallback(async (question) => {
    if (!question) {
      // All questions complete, now "thinking"
      setStatus('thinking');
      
      // Get summary asynchronously
      try {
        const generatedSummary = await AssessmentService.getSummaryAsync();
        setSummary(generatedSummary);
        finishAssessment(generatedSummary);
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary('Error generating assessment summary.');
        finishAssessment('Error generating assessment summary.');
      }
      return;
    }
    
    // Clear the last response when moving to a new question
    setLastResponse('');
    
    setStatus('speaking');
    try {
      // Speak the question
      await speak(question);
      
      // Start listening for response
      setStatus('listening');
      startListening();
    } catch (error) {
      console.error('Error asking question:', error);
      setStatus('error');
    }
  }, [speak, startListening]);
  
  const finishAssessment = useCallback((assessmentSummary) => {
    setStatus('complete');
    setCurrentQuestion('');
    setShowAssessment(true);
    
    // Speak the summary
    if (assessmentSummary) {
      speak(`Thank you for completing the assessment. Here is the summary of findings: ${assessmentSummary.replace('\n\n', '. ')}`);
    } else {
      speak(`Thank you for completing the assessment.`);
    }
  }, [speak]);
  
  // Handle transcripts from speech recognition
  useEffect(() => {
    if (transcript && status === 'listening') {
      // Stop listening once we have a response
      stopListening();
      setStatus('confirming');
      setPendingResponse(transcript);
      setConfirmingResponse(true);
    }
  }, [transcript, status, stopListening]);

  const handleResponseConfirmed = (confirmedResponse) => {
    setLastResponse(confirmedResponse);
    setConfirmingResponse(false);
    setStatus('processing');
    
    // Record the response and get the next question
    const nextQuestion = AssessmentService.recordResponse(confirmedResponse);
    setCurrentQuestion(nextQuestion);
    
    // Update question index for progress bar
    setCurrentQuestionIndex(prev => prev + 1);
    
    // Update the responses table
    setAllResponses(AssessmentService.getResponses());
    
    // Small delay before next question
    setTimeout(() => {
      askQuestion(nextQuestion);
    }, 1000);
  };
  
  // Get voice status text
  const getVoiceStatusText = () => {
    if (status === 'speaking') return "AI Speaking...";
    if (status === 'listening') return "Listening...";
    if (status === 'processing') return "Processing...";
    return "";
  };
  
  return (
    <div className="assessment-container">
      <h2>Assessment</h2>
      
      <div className="controls">
        <Button 
          onClick={startAssessment} 
          disabled={status !== 'idle' && status !== 'complete' && status !== 'error'}
        >
          {status === 'idle' || status === 'complete' ? 'Start Assessment' : 'Assessment in Progress'}
        </Button>
        <div className={`status-pill ${status}`}>
          {status === 'speaking' ? 'Speaking' : 
          status === 'listening' ? 'Listening...' : 
          status === 'confirming' ? 'Please confirm response' :
          status === 'processing' ? 'Processing...' :
          status === 'thinking' ? 'Analyzing results with AI...' :
          status === 'complete' ? 'Complete' : 
          status === 'error' ? 'Error' : 'Ready'}
        </div>
      </div>
      
      {/* Progress bar - visible during assessment */}
      {!showAssessment && status !== 'idle' && (
        <ProgressBar 
          current={currentQuestionIndex} 
          total={assessmentQuestions.length}
          labels={progressLabels}
        />
      )}
      
      <div className={`assessment-content ${showAssessment ? 'completed' : ''}`}>
        {/* Left side - Current Q&A (shown only during assessment) */}
        {!showAssessment && (
          <div className="current-qa-section">
            <QuestionDisplay question={currentQuestion} isListening={isListening} />
            
            {lastResponse && !confirmingResponse && (
              <ResponseDisplay response={lastResponse} />
            )}

            {confirmingResponse && (
              <div className="confirmation-container">
                <h3>Please confirm your response:</h3>
                <ResponseConfirmation 
                  response={pendingResponse}
                  onConfirm={handleResponseConfirmed}
                  onEdit={() => {}} // This is handled internally in the component
                />
              </div>
            )}
            
            {status === 'thinking' && (
              <ThinkingIndicator message="Analyzing responses with AI and generating assessment..." />
            )}
          </div>
        )}
        
        {/* Right side - Q&A History (always shown after first response) */}
        <div className={`qa-history-section ${showAssessment ? 'expanded' : ''}`}>
          {Object.keys(allResponses).length > 0 && (
            <QADisplay responses={allResponses} />
          )}
        </div>
        
        {/* Right side (below Q&A History) - Assessment Summary */}
        {showAssessment && (
          <div className="summary-section">
            <EnhancedSummaryDisplay summary={summary} isComplete={status === 'complete'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentContainer;