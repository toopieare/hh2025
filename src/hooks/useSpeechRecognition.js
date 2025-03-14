import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = (options = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const { lang = 'en-US', continuous = false, interimResults = false } = options;
  
  // Initialize speech recognition
  const recognition = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError(new Error('Speech recognition not supported'));
      return null;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = interimResults;
    recognitionInstance.lang = lang;
    
    return recognitionInstance;
  }, [continuous, interimResults, lang]);
  
  const startListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (!recognitionInstance) return;
    
    setError(null);
    setTranscript('');
    
    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };
    
    recognitionInstance.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    try {
      recognitionInstance.start();
      setIsListening(true);
    } catch (err) {
      setError(err);
    }
    
    return recognitionInstance;
  }, [recognition]);
  
  const stopListening = useCallback((recognitionInstance) => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsListening(false);
    }
  }, []);
  
  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening
  };
};