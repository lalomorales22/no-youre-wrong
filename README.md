# No, You're Wrong! 🎯
![Screenshot 2025-06-19 at 4 11 15 PM](https://github.com/user-attachments/assets/b406e838-0e0b-410b-99ee-48f1eea8f126)

**Professional Argument Analysis & Resolution**

Transform disagreements into productive discussions with AI-powered analysis. Get objective scoring, detailed feedback, and actionable resolution strategies for better communication and understanding.

🌐 **Live Demo**: [https://polite-sprinkles-00feef.netlify.app](https://polite-sprinkles-00feef.netlify.app)

## 🚀 Features

- **Intelligent Analysis**: Advanced AI processes your discussion to identify key arguments, logical structure, and communication patterns
- **Objective Scoring**: Comprehensive evaluation across logic, emotional intelligence, and communication effectiveness
- **Resolution Strategies**: Actionable recommendations and fun tasks designed to facilitate understanding
- **Real-time Recording**: Browser-based audio recording with automatic transcription
- **Beautiful UI**: Modern, responsive design with smooth animations and professional aesthetics
- **Privacy Focused**: Your discussions remain confidential and secure

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4 and Whisper API
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenAI API key

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalomorales22/no-youre-wrong.git
   cd no-youre-wrong
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Getting an OpenAI API Key:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy and paste it into your `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application

## 🎮 How to Use

### Step 1: Register Participants
- Enter the names of both discussion participants
- Click "Continue to Recording"

### Step 2: Record Discussion
- Click the microphone button to start recording
- Present your arguments clearly and respectfully
- Allow each participant to speak without interruption
- Click the stop button when finished

### Step 3: AI Analysis
- The system automatically transcribes your audio
- AI analyzes the discussion for logic, emotional intelligence, and communication
- Processing typically takes 30-60 seconds

### Step 4: Review Results
- View detailed analysis and scoring breakdown
- See who scored higher and why
- Get personalized resolution tasks to strengthen your relationship

## 📊 Scoring System

The AI evaluates participants across three key dimensions:

- **Logic & Reasoning** (40 points): Factual accuracy, logical consistency, evidence quality
- **Emotional Intelligence** (30 points): Empathy, understanding, emotional awareness
- **Communication Style** (30 points): Clarity, respectfulness, active listening

**Total Score**: 100 points maximum

## 🎯 Recording Guidelines

For best results:
- Speak clearly and at a moderate pace
- Allow each participant to present their full argument
- Avoid interrupting or speaking over each other
- Focus on facts, reasoning, and respectful communication
- Keep the discussion focused on the specific topic

## 🏗️ Build & Deployment

### Local Build
```bash
npm run build
```

### Deploy to Netlify
The application is configured for easy Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

## 🔒 Privacy & Security

- Audio recordings are processed in real-time and not stored
- Transcripts are sent to OpenAI for analysis only
- No personal data is permanently stored
- All communications are encrypted in transit

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check that your OpenAI API key is correctly set
2. Ensure your browser supports audio recording (HTTPS required for production)
3. Verify microphone permissions are granted
4. Check the browser console for any error messages

## 🎉 Built With BOLT

This application was built using [Bolt](https://bolt.new) - the fastest way to build and deploy full-stack web applications.

---

**Made with ❤️ for better communication and understanding**
