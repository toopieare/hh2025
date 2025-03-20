# API Documentation

This document outlines the API structure of the CGA Clarity application, including both client-side and server-side APIs.

## Server-Side API Endpoints

The following REST API endpoints are available when running the Express server component:

### OpenAI Proxy API

#### Generate Clinical Summary
```
POST /api/openai/generate-summary
```

Proxies requests to OpenAI's API to generate clinical summaries based on assessment data.

**Request Body:**
```json
{
  "prompt": "String containing the full assessment prompt with Q&A history"
}
```

**Response:**
```json
{
  "summary": "Generated clinical summary text"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional error details if available"
}
```

#### Health Check
```
GET /api/health
```

Simple endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Client-Side Services API

The application uses several JavaScript service modules that act as internal APIs:

### AssessmentService

Manages the assessment process, questions, and responses.

```javascript
// Get the current question
const currentQuestion = AssessmentService.getCurrentQuestion();

// Record a response and advance to the next question
const nextQuestion = AssessmentService.recordResponse(response);

// Get assessment summary
const summary = await AssessmentService.getSummaryAsync();

// Get all recorded responses
const responses = AssessmentService.getResponses();

// Reset the assessment
AssessmentService.reset();
```

### AnalysisService

Handles text analysis and LLM integration for clinical assessments.

```javascript
// Analyze a response for specific symptoms
const hasSymptom = AnalysisService.analyzeResponse(response, symptomType);

// Generate a summary using zero-shot LLM prompting
const summary = await AnalysisService.generateSummaryWithZeroShot(responses);

// Detect symptoms from responses
const symptoms = AnalysisService.detectSymptoms(responses);

// Identify cognitive issues based on symptoms
const issues = AnalysisService.identifyCognitiveIssues(detectedSymptoms);
```

### Speech Recognition and Synthesis Hooks

Custom React hooks that provide speech functionality:

#### useSpeechRecognition

```javascript
const { 
  transcript,     // Current recognized speech text
  isListening,    // Boolean indicating if actively listening
  error,          // Error object if speech recognition fails
  startListening, // Function to start speech recognition
  stopListening   // Function to stop speech recognition
} = useSpeechRecognition(options);
```

#### useSpeechSynthesis

```javascript
const {
  speak,       // Function to synthesize speech: (text, options) => Promise
  cancel,      // Function to cancel ongoing speech
  speaking,    // Boolean indicating if currently speaking
  supported    // Boolean indicating if speech synthesis is supported
} = useSpeechSynthesis();
```

## Future API Extensions (In Progress)

### Planned Integration APIs

#### Electronic Health Record (EHR) Integration
```
POST /api/ehr/patient-data
GET /api/ehr/patient/:id
PUT /api/ehr/assessment/:id
```

#### Multi-language Support
```
POST /api/translation/detect
POST /api/translation/translate
```

#### Clinical Recommendations
```
POST /api/clinical/recommendations
GET /api/clinical/guidelines/:condition
```

## API Security Considerations

The current implementation includes:

1. **API Key Protection**: Server-side proxy to avoid exposing OpenAI API keys in client-side code
2. **Content Validation**: Request validation to ensure proper format and content
3. **Error Handling**: Structured error responses with appropriate HTTP status codes

Planned security enhancements:
1. **Rate Limiting**: To prevent abuse of the API
2. **Request Logging**: For audit and debugging purposes
3. **Request Authentication**: Token-based authentication for protected endpoints
4. **Data Encryption**: For sensitive patient information

## Development and Testing

To test the API endpoints:

1. Start the development server:
   ```
   npm run dev
   ```

2. Use tools like Postman or cURL to test the endpoints:
   ```bash
   curl -X POST http://localhost:3001/api/openai/generate-summary \
     -H "Content-Type: application/json" \
     -d '{"prompt":"Your test prompt here"}'
   ```

3. Monitor the server console for request logs and errors