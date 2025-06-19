import React from 'react';
import { MessageSquare, BarChart3, Users, CheckCircle, ArrowRight, Zap, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-primary">
            No, You're Wrong!
            <span className="block text-muted-foreground text-3xl mt-2">Professional Argument Analysis & Resolution</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform disagreements into productive discussions with AI-powered analysis. 
            Get objective scoring, detailed feedback, and actionable resolution strategies.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 gap-2"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-md bg-primary/10 p-2">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Intelligent Analysis</h3>
          </div>
          <p className="text-muted-foreground">
            Advanced AI processes your discussion to identify key arguments, 
            logical structure, and communication patterns.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-md bg-primary/10 p-2">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Objective Scoring</h3>
          </div>
          <p className="text-muted-foreground">
            Comprehensive evaluation across logic, emotional intelligence, 
            and communication effectiveness with detailed breakdowns.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-md bg-primary/10 p-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Resolution Strategies</h3>
          </div>
          <p className="text-muted-foreground">
            Receive actionable recommendations and tasks designed to 
            facilitate understanding and productive resolution.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process ensures fair, objective analysis of your discussion
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              1
            </div>
            <h4 className="font-semibold">Register Participants</h4>
            <p className="text-sm text-muted-foreground">
              Enter the names of both discussion participants
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              2
            </div>
            <h4 className="font-semibold">Record Discussion</h4>
            <p className="text-sm text-muted-foreground">
              Present your arguments clearly and respectfully
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              3
            </div>
            <h4 className="font-semibold">AI Processing</h4>
            <p className="text-sm text-muted-foreground">
              Advanced analysis of arguments and communication
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              4
            </div>
            <h4 className="font-semibold">Receive Results</h4>
            <p className="text-sm text-muted-foreground">
              Detailed analysis and resolution recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Why Choose No, You're Wrong!?</h2>
          <p className="text-muted-foreground">
            Professional-grade analysis for better communication and understanding
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Objective Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Remove emotional bias with AI-powered evaluation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Detailed Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive scoring across multiple dimensions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Actionable Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Practical steps for resolution and improvement
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Privacy Focused</h4>
                <p className="text-sm text-muted-foreground">
                  Your discussions remain confidential and secure
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Fast Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Get results in minutes, not hours or days
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Professional Grade</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-level analysis for personal use
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6 py-16 border-t border-border">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">
            Ready to Resolve Your Discussion?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform disagreements into opportunities for better understanding and communication.
          </p>
        </div>
        
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 gap-2 text-base"
        >
          <Zap className="w-5 h-5" />
          Begin Analysis
        </button>
      </div>

      {/* Built with Bolt Badge */}
      <div className="flex justify-center pb-8">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Zap className="w-4 h-4" />
          Built with Bolt
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}