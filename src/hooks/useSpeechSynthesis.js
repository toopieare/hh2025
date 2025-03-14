import { useCallback, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState('speechSynthesis' in window);
  
  const speak = useCallback((text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!supported) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options
      if (options.voice) utterance.voice = options.voice;
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume) utterance.volume = options.volume;
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        resolve();
      };
      utterance.onerror = (error) => {
        setSpeaking(false);
        reject(error);
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }, [supported]);
  
  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);
  
  return {
    speak,
    cancel,
    speaking,
    supported
  };
};