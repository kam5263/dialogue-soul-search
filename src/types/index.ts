
export interface UserInfo {
  name: string;
  mbti?: string;
  gender?: 'male' | 'female' | '';
}

export interface AnalysisData {
  // Personality analysis
  predictedMbti: {
    user: string;
    partner: string;
  };
  toneAnalysis: {
    user: {
      formal: number;
      casual: number;
      emotional: number;
    };
    partner: {
      formal: number;
      casual: number;
      emotional: number;
    };
  };
  emotionScores: {
    user: {
      happiness: number;
      sadness: number;
      anger: number;
      fear: number;
      surprise: number;
      disgust: number;
      neutral: number;
    };
    partner: {
      happiness: number;
      sadness: number;
      anger: number;
      fear: number;
      surprise: number;
      disgust: number;
      neutral: number;
    };
  };
  emotionTimeline: {
    timestamps: string[];
    user: {
      happiness: number[];
      sadness: number[];
      anger: number[];
      fear: number[];
      surprise: number[];
      disgust: number[];
      neutral: number[];
    };
    partner: {
      happiness: number[];
      sadness: number[];
      anger: number[];
      fear: number[];
      surprise: number[];
      disgust: number[];
      neutral: number[];
    };
  };

  // Affinity analysis
  affinityScores: {
    user: number;
    partner: number;
  };
  pushPullIndex: {
    user: number;
    partner: number;
  };
  insights: {
    responsePatterns: string;
    optimalTimes: string;
    relationshipBalance: string;
  };

  // Conversation pattern analysis
  messageRatio: {
    user: number;
    partner: number;
  };
  responseTime: {
    user: number;
    partner: number;
  };
  timeDistribution: {
    hours: string[];
    user: number[];
    partner: number[];
  };

  // Content analysis
  wordFrequency: {
    user: { word: string; count: number }[];
    partner: { word: string; count: number }[];
  };
  topics: {
    name: string;
    percentage: number;
    color: string;
  }[];
  topicTimeline: {
    timestamps: string[];
    topics: { [topic: string]: number[] };
  };

  // Summary and recommendations
  solutions: {
    timing: string;
    actions: string;
    topics: string;
    responses: string;
  };
  actionPlan: string[];
}

export interface AppState {
  uploadedFile: File | null;
  userInfo: {
    user: UserInfo;
    partner: UserInfo;
  };
  analysisData: AnalysisData | null;
  currentStep: 'upload' | 'info' | 'analysis';
  analysisTab: 'personality' | 'affinity' | 'pattern' | 'content' | 'summary';
  isAnalyzing: boolean;
}
