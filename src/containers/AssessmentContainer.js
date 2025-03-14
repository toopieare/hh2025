import React, { useState, useEffect, useCallback } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';
import ResponseDisplay from '../components/ResponseDisplay';
import SummaryDisplay from '../components/SummaryDisplay';
import QADisplay from '../components/QADisplay';
import Button from '../components/Button';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import AssessmentService from '../services/AssessmentService';

const AssessmentContainer = () => {
  const [status, setStatus] = useState('idle'); // idle, speaking, listening, processing, complete
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [allResponses, setAllResponses] = useState({});
  
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { speak, speaking, cancel } = useSpeechSynthesis();
  
  const startAssessment = useCallback(async () => {
    // Reset the assessment
    AssessmentService.reset();
    setStatus('starting');
    setLastResponse('');
    setSummary('');
    setAllResponses({});
    
    // Introduction message
    try {
      await speak("I'm going to ask you some questions about your family member's health. Please respond after each question.");
      
      // Start with first question
      const firstQuestion = AssessmentService.getCurrentQuestion();
      setCurrentQuestion(firstQuestion);
      
      // Ask the first question
      await askQuestion(firstQuestion);
    } catch (error) {
      console.error('Error starting assessment:', error);
      setStatus('error');
    }
  }, [speak]);
  
  const askQuestion = useCallback(async (question) => {
    if (!question) {
      // Assessment complete
      finishAssessment();
      return;
    }
    
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
  
  const finishAssessment = useCallback(() => {
    setStatus('complete');
    setCurrentQuestion('');
    
    // Generate and speak summary
    const assessmentSummary = AssessmentService.getSummary();
    setSummary(assessmentSummary);
    
    speak("Thank you for completing the assessment. Here is the summary of findings: " + 
          assessmentSummary.replace('\n\n', '. '));
  }, [speak]);
  
  // Handle transcripts from speech recognition
  useEffect(() => {
    if (transcript && status === 'listening') {
      // Stop listening once we have a response
      stopListening();
      setStatus('processing');
      setLastResponse(transcript);
      
      // Record the response and get the next question
      const nextQuestion = AssessmentService.recordResponse(transcript);
      setCurrentQuestion(nextQuestion);
      
      // Update the responses table
      setAllResponses(AssessmentService.getResponses());
      
      // Small delay before next question
      setTimeout(() => {
        askQuestion(nextQuestion);
      }, 1000);
    }
  }, [transcript, status, stopListening, askQuestion]);
  
  return (
    <div className="assessment-container">
      <h2>Voice-Enabled Medical Assessment</h2>
      
      <div className="controls">
        <Button 
          onClick={startAssessment} 
          disabled={status !== 'idle' && status !== 'complete' && status !== 'error'}
        >
          Start Assessment
        </Button>
        <div className="status-indicator">
          Status: {status === 'speaking' ? 'Speaking' : 
                  status === 'listening' ? 'Listening...' : 
                  status === 'processing' ? 'Processing...' : 
                  status === 'complete' ? 'Complete' : 
                  status === 'error' ? 'Error' : 'Ready'}
        </div>
      </div>
      
      <QuestionDisplay question={currentQuestion} isListening={isListening} />
      
      {lastResponse && <ResponseDisplay response={lastResponse} />}
      
      <QADisplay responses={allResponses} />
      
      <SummaryDisplay summary={summary} isComplete={status === 'complete'} />
    </div>
  );
};

export default AssessmentContainer;