## NUS Health Hack 2025 Project: CGA Clarity
Members: Alfred Ho, Raymond Lu, Qihuang Xie, Kenneth Yong

This repository contains our hackathon entry for a technology-based solution to implement the Comprehensive Geriatric Assessment (CGA) inspired by the [Polaris LLM constellation architecture](https://arxiv.org/pdf/2403.13313). Our system is designed to conduct the CGA through natural voice conversations with patients.

## Current Progress & Features

We've developed a portion of the functionality within the limited hackathon timeframe:

- [x] **Complete UI Framework** - A React-based interface with patient dashboard, assessment interface, and result visualization
- [x] **Voice-based Interaction** - Fully implemented speech recognition and text-to-speech for natural conversations (in English)
- [x] **Progress Tracking** - Visual indicators showing assessment completion status
- [x] **Response Confirmation** - Patient responses can be reviewed and edited for accuracy
- [x] **Enhanced Summaries** - Visualization of assessment results with clinical insights
- [x] **Basic Question Bank** - Initial set of cognitive assessment questions implemented

### Current Specialist Components:
- [x] **Question Display** - Shows current questions with visual indicators
- [x] **Response Management** - Records and processes patient responses
- [x] **Basic NLP Analysis** - Simple text analysis for symptom detection

## Upcoming Features & Timeline

Inspired by the [Polaris LLM constellation architecture](https://arxiv.org/pdf/2403.13313), we're building a multi-agent system with these planned components:

### Short-term (1-2 months):
- [ ] **Checklist Specialist** - Ensure all assessment objectives are completed 
- [ ] **Enhanced Text Analysis** - Improved symptom pattern recognition 
- [ ] **Human Intervention Specialist** - Detect when human healthcare professionals should be involved

### Medium-term (2-4 months):
- [ ] **EHR Integration** - Connect with patient record systems
- [ ] **Privacy & Compliance Specialist** - Enhance identity verification and privacy controls
- [ ] **Labs & Vitals Specialist** - Add capability to discuss and analyze patient lab results

### Long-term (6-12 months):
- [ ] **Full Constellation Architecture** - Complete implementation of all specialist agents
- [ ] **Medical Knowledge Base** - Expanded database of clinical conditions
- [ ] **Multi-call Relationships** - Support for ongoing patient relationships across calls
- [ ] **Multi-modal Support** - Add support for visual cues and assessments

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
└────────────────────┘    └─────────────────────┘
```

## Implementation Details

The project is built using:
- **React** for the frontend
- **Web Speech API** for voice interaction
- **LLM APIs** for natural language processing (In Progress)
- **Context API** for state management (In Progress)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/hh2025.git

# Install dependencies
cd hh2025
npm install

# Start the development server
npm start
```

## References

Mukherjee, S., Gamble, P., Ausin, M. S., Kant, N., Aggarwal, K., Manjunath, N., Datta, D., Liu, Z., Ding, J., Busacca, S., Bianco, C., Sharma, S., Lasko, R., Voisard, M., Harnejas, S., Filippova, D., Meixiong, G., Cha, K., Youssefi, A., Buvanesh, M., Weingram, H., Bierman-Lyle, S., Mangat, H. S., Parikh, K., Godil, S., & Miller, A. (2024). Polaris: A Safety-focused LLM Constellation Architecture for Healthcare. arXiv:2403.13313. https://arxiv.org/pdf/2403.13313

---

**Note:** This project is currently under active development for NUS Health Hack 2025. The architecture is inspired by the Polaris system described in ["Polaris: A Safety-focused LLM Constellation Architecture for Healthcare"](https://arxiv.org/pdf/2403.13313) (Mukherjee et al., 2024) but implemented at a smaller scale for the hackathon timeline.