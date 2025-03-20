## NUS Health Hack 2025 Project: CGA Clarity
Members: Alfred Ho, Raymond Lu, Qihuang Xie, Kenneth Yong

This repository contains our hackathon entry for a technology-based solution to implement the Comprehensive Geriatric Assessment (CGA) inspired by the [Polaris LLM constellation architecture](https://arxiv.org/pdf/2403.13313). Our system is designed to conduct the CGA through natural voice conversations with patients or caregivers.

## Current Progress & Features

We've developed a portion of the functionality within the limited hackathon timeframe:

- [x] **Complete UI Framework** - A React-based interface with patient dashboard, assessment interface, and result visualization
- [x] **Intelligent Voice Interaction** - Seamless conversational experience with advanced speech recognition and natural text-to-speech synthesis for fluid clinical assessment dialog (in English)
- [x] **Progress Tracking** - Visual indicators showing assessment completion status
- [x] **Zero-Shot AI-Powered Summaries** - Clinical assessments generated using zero-shot prompting to LLMs, producing professional geriatric assessments without requiring training data
- [x] **Basic Question Bank** - Initial set of cognitive assessment questions implemented

### Current Specialist Components:
- [x] **Question Display** - Shows current questions with visual indicators
- [x] **Response Management** - Records and processes patient responses
- [x] **Basic NLP Analysis** - Simple text analysis for symptom detection


## Implementation Details

The project is built using:

- **React** for the frontend
- **Web Speech API** for natural voice interaction
- **OpenAI API** for zero-shot clinical assessment generation
- **Express.js** for secure API proxying
- **Context API** for state management (In Progress)


## Upcoming Features & Timeline

Inspired by the [Polaris LLM constellation architecture](https://arxiv.org/pdf/2403.13313), we're building a multi-agent system with these planned components:

### Short-term (1-2 months):
- [ ] **Checklist Specialist** - Ensure all assessment objectives are completed 
- [ ] **Enhanced Text Analysis** - Improved symptom pattern recognition 
- [ ] **Human Intervention Specialist** - Detect when human healthcare professionals should be involved
- [ ] **Expanded Language Capabilities** - Use appropriate APIs for languages common in Singapore

### Medium-term (2-4 months):
- [ ] **EHR Integration** - Connect with patient record systems
- [ ] **Privacy & Compliance Specialist** - Enhance identity verification and privacy controls
- [ ] **Recommendations** - Creating recommendations and drafting memos to healthcare professionals

### Long-term (6-12 months):
- [ ] **Full Constellation Architecture** - Complete implementation of all specialist agents
- [ ] **Medical Knowledge Base** - Expanded database of clinical conditions
- [ ] **Multi-call Relationships** - Support for ongoing patient relationships across calls
- [ ] **Connection to Care Agencies** - Linkage with other care agencies suited to patient's needs

## Technical Architecture

Our system follows a multi-agent constellation approach:

```
┌─────────────────────────────────────────────────────┐
│                     Primary Agent                   │
│  (Conversation Management, Patient Interaction)     │
└───────────────────────┬─────────────────────────────┘
            ┌───────────┴──────────┐
            ▼                      ▼
┌────────────────────┐    ┌─────────────────────┐
│ Support Agents     │    │ Orchestration       │
│ - Question Bank    │    │ - State Management  │
│ - Symptom Analysis │    │ - Progress Tracking │
│ - Zero-Shot LLM    │    │ - Clinical Context  │
└────────────────────┘    └─────────────────────┘
```

## Setup & Prerequisites

Before running the application, you'll need:

1. **OpenAI API Key**: 
   - Create an account at [OpenAI Platform](https://platform.openai.com)
   - Generate an API key in your account dashboard
   - Set up as an environment variable (see below)

2. **Environment Configuration**:
   - Create a `.env.local` file in the root directory with:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
   - For production deployment, set environment variables in your hosting platform

3. **Node.js**: Version 14.0.0 or higher


## Getting Started

```bash
# Clone the repository
git clone https://github.com/toopieare/hh2025.git

# Install dependencies
cd hh2025
npm install

# Set up your OpenAI API key in .env.local
echo "REACT_APP_OPENAI_API_KEY=your_api_key_here" > .env.local

# Start the development server (React frontend only)
npm run client

# For full application with API proxy
npm run dev
```

## Deployment

For deployment, we recommend a non-static site approach to securely handle API keys:

```bash
# Build the React application
npm run build

# Start the production server
npm start
```

When deploying to platforms like DigitalOcean:
1. Configure as a Web Service (not a static site)
2. Set the environment variable `OPENAI_API_KEY` in your platform settings
3. Set the run command to `npm start`

## References

Mukherjee, S., Gamble, P., Ausin, M. S., Kant, N., Aggarwal, K., Manjunath, N., Datta, D., Liu, Z., Ding, J., Busacca, S., Bianco, C., Sharma, S., Lasko, R., Voisard, M., Harnejas, S., Filippova, D., Meixiong, G., Cha, K., Youssefi, A., Buvanesh, M., Weingram, H., Bierman-Lyle, S., Mangat, H. S., Parikh, K., Godil, S., & Miller, A. (2024). Polaris: A Safety-focused LLM Constellation Architecture for Healthcare. arXiv:2403.13313. https://arxiv.org/pdf/2403.13313

---

**Note:** This project is currently under active development for NUS Health Hack 2025. The architecture is inspired by the Polaris system described in ["Polaris: A Safety-focused LLM Constellation Architecture for Healthcare"](https://arxiv.org/pdf/2403.13313) (Mukherjee et al., 2024) but implemented at a smaller scale for the hackathon timeline.