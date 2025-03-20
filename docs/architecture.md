# Architecture Documentation

This document outlines the system architecture of the CGA Clarity application, including current implementation and planned future developments.

## System Overview

CGA Clarity is a clinical assessment application designed to conduct Comprehensive Geriatric Assessments through natural voice conversations with patients or caregivers. The system uses a multi-agent approach inspired by the Polaris LLM constellation architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Application                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────────────┐    │
│  │  React UI Layer │   │  Context/State  │   │  Component Layer   │    │
│  │                 │   │  Management     │   │                    │    │
│  └────────┬────────┘   └────────┬────────┘   └─────────┬──────────┘    │
│           │                     │                      │                │
│           └─────────────────────┼──────────────────────┘                │
│                                 │                                       │
│  ┌─────────────────────────────┐│┌────────────────────────────────────┐ │
│  │     Services & Hooks        │││        Assessment Engine           │ │
│  │                             │││                                    │ │
│  │  ┌─────────────────────┐    │││  ┌────────────────┐ ┌───────────┐ │ │
│  │  │  Speech Recognition │    │││  │ Question Bank  │ │  NLP/     │ │ │
│  │  │  & Synthesis        │    │││  │ Management     │ │  Analysis │ │ │
│  │  └─────────────────────┘    │││  └────────────────┘ └───────────┘ │ │
│  │                             │││                                    │ │
│  │  ┌─────────────────────┐    │││  ┌────────────────┐ ┌───────────┐ │ │
│  │  │  Assessment Service │◄───┘││  │  Zero-Shot     │ │ Symptom   │ │ │
│  │  │                     │     ││  │  LLM Prompting │ │ Detection │ │ │
│  │  └─────────────────────┘     ││  └────────────────┘ └───────────┘ │ │
│  │                              ││                                    │ │
│  │  ┌─────────────────────┐     ││  ┌────────────────────────────┐   │ │
│  │  │  Analysis Service   │◄────┘│  │ Clinical Summary Generation │   │ │
│  │  │                     │      │  │                            │   │ │
│  │  └─────────────────────┘      │  └────────────────────────────┘   │ │
│  └──────────────────────────────┬┘└────────────────────────────────────┘ │
│                                 │                                       │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              Server Layer                                │
│                                                                          │
│  ┌────────────────────────┐   ┌────────────────────────────────────┐    │
│  │      Express Server    │   │             API Routes             │    │
│  │                        │   │                                    │    │
│  └──────────┬─────────────┘   └───────────────────┬────────────────┘    │
│             │                                     │                      │
│             └─────────────────┬───────────────────┘                      │
│                               │                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                       External API Proxies                      │    │
│  │                                                                 │    │
│  │   ┌───────────────────┐   ┌───────────────────────────────┐    │    │
│  │   │    OpenAI API     │   │  Other Services (planned)     │    │    │
│  │   │    Integration    │   │                               │    │    │
│  │   └───────────────────┘   └───────────────────────────────┘    │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Key Components

### Frontend Components

#### 1. React UI Layer
- **Dashboard Page**: Patient selection and overview
- **Patient Profile Page**: Patient details and assessment interface 
- **Assessment Container**: Core assessment interaction component
- **Enhanced Summary Display**: Clinical findings visualization

#### 2. Service Layer
- **AssessmentService**: Manages assessment flow, questions, and responses
- **AnalysisService**: Performs text analysis and LLM integration for clinical assessments
- **Speech Services**: Custom hooks for speech recognition and synthesis

#### 3. Component Layer
- **QuestionDisplay**: Renders current assessment question
- **ResponseDisplay**: Shows the last response recorded
- **QADisplay**: Tabular view of all questions and answers
- **ProgressBar**: Visual indicator of assessment progress
- **ThinkingIndicator**: Visual feedback during AI processing
- **ResponseConfirmation**: Interface for confirming and editing responses

### Backend Components

#### 1. Express Server
- Serves the static React application in production
- Provides API endpoints for frontend services
- Handles environment configuration and security

#### 2. API Proxy
- Securely handles OpenAI API communication
- Protects API keys from client-side exposure
- Provides abstraction for future service integrations

## Data Flow

1. **Assessment Initiation**:
   - User selects a patient from the dashboard
   - AssessmentService loads the question bank
   - UI presents the first question and begins voice interaction

2. **Question-Answer Cycle**:
   - System speaks the current question using speech synthesis
   - Speech recognition captures and displays the user's response
   - User confirms or edits the transcribed response
   - AssessmentService stores the response and advances to the next question

3. **Analysis Process**:
   - After all questions are answered, AnalysisService processes responses
   - Symptom patterns are detected using NLP techniques
   - Zero-shot prompting transforms conversational data into clinical findings

4. **Summary Generation**:
   - Clinical data is sent to OpenAI API via server proxy
   - LLM generates a structured clinical summary based on the assessment data
   - Summary is parsed and presented in an enhanced visual format

## Zero-Shot Prompting Architecture

The zero-shot prompting system follows this process:

1. **Prompt Construction**:
   - Format assessment Q&A data into a structured prompt
   - Add system instructions with clinical context ("You are a geriatrician...")
   - Include specialized instructions to focus on specific aspects (falls, cognitive domains)
   - Provide format guidelines for the expected clinical assessment

2. **API Processing**:
   - Send the constructed prompt to OpenAI API through secure proxy
   - Apply temperature settings for consistent clinical output
   - Process the response to extract clinical findings

3. **Result Parsing**:
   - Parse the generated text to identify key sections (falls history, cognitive assessment)
   - Extract specific clinical findings and their justifications
   - Identify important clinical terms (Amnesia, Agnosia, Apraxia, Aphasia)
   - Format for presentation in the UI with appropriate severity indicators

## In-Development Components

### Security Layer (In Progress)
- **Authentication System**: User authentication and role-based access control
- **Data Encryption**: Secure storage and transmission of patient data
- **Audit Logging**: Comprehensive logging of system activities

### EHR Integration (Planned)
- **Patient Data Connector**: Interface with electronic health record systems
- **Data Synchronization**: Bidirectional synchronization of patient information
- **Report Generation**: Export of assessment results to clinical formats

### Multi-Agent System (Planned)
Based on the Polaris architecture, we plan to implement:

- **Checklist Specialist**: Ensures assessment completeness
- **Human Intervention Specialist**: Identifies when human clinicians should be involved
- **Privacy & Compliance Specialist**: Ensures adherence to healthcare regulations
- **Medical Knowledge Base**: Expanded clinical reference database

## Technical Stack

- **Frontend**: React, React Router, Web Speech API
- **State Management**: React Context API
- **Backend**: Node.js, Express
- **AI/ML**: OpenAI API (GPT models)
- **Multi-language Support**: Azure AI Speech (planned)
- **Deployment**: DigitalOcean App Platform
- **Security**: PDPA-compliant data handling (planned)

## Scalability and Evaluation Considerations

The current architecture supports scalability through:

1. **Component Modularity**: Clear separation of concerns for easy extension
2. **Service Abstractions**: Well-defined service interfaces for future enhancements
3. **API Proxying**: Server-side component that can be scaled independently
4. **Stateless Design**: Components rely on passed data rather than global state

Future scalability enhancements will include:
1. **Database Integration**: For persistent storage of assessment data
2. **Multi-language Support**: Scaling to support various languages common in Singapore
3. **Expanded Orchestration**: Handling multiple assessment domains in CGA
4. **Microservice Architecture**: Breaking down monolithic components
5. **Containerization**: Docker-based deployment for better scaling

Post-implementation evaluation will include:
1. **Performance Monitoring**: Tracking response times, success rates, and user experience
2. **Model Drift Detection**: Ensuring the model maintains consistent performance over time
3. **Clinical Accuracy Verification**: Validating assessment results against professional diagnoses
4. **User Satisfaction Metrics**: Gathering feedback from healthcare providers and patients
5. **Compliance Auditing**: Regular checks for adherence to privacy and security regulations

## Development Guidelines

When extending this architecture:

1. Maintain clear separation between UI, services, and data layers
2. Use the established service patterns for new functionality
3. Keep AI/LLM integration within the AnalysisService
4. Follow the pattern of server-side API proxying for external services
5. Consider accessibility throughout the development process
6. Maintain a consistent error handling approach across components