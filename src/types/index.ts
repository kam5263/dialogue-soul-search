import partner from '../../public/partner.png';

export interface UserInfo {
  name: string;
  mbti?: string;
  gender?: 'male' | 'female' | '';
  extractedName?: string;
}

export type TimeLabel =
  | "새벽(00~06시)"
  | "오전(06~12시)"
  | "오후(12~18시)"
  | "밤(18~00시)";

export interface AnalysisData {
  // Personality analysis
  mbti_prediction: {
    confidence: string;
    type: string;
    mbti_comments: string;
  };
  conversational_tone: {
    user: string;
    partner: string;
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
  likability_score: {
    user: string;
    partner: string;
  };
  pattern: {
    mildang_index: {
      user: string;
      partner: string;
    },
    message_ratio: {
      user: string;
      partner: string;
    },
    question_ratio: {
      user: string;
      partner: string;
    },
    avg_reply_time: {
      user: string;
      partner: string;
    },
    avg_message_length: {
      user: string;
      partner: string;
    }
    ,
    session_start_ratio: {
      user: string;
      partner: string;
    }
    ,
    timeframe_ratio: Record<string, Record<TimeLabel, number>>;
  };
  
  likability_comments: string[];
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
    conversation_advice: string[];
    action_plan: string[];
  };  
}

export interface AppState {
  uploadedFile: File | null;
  fileName: string | null;
  userInfo: {
    user: UserInfo;
    partner: UserInfo;
  };
  predictedSpeakers : string[];
  analysisData: AnalysisData | null;
  currentStep: 'upload' | 'info' | 'analysis';
  analysisTab: 'personality' | 'affinity' | 'pattern' | 'content' | 'summary';
  isAnalyzing: boolean;
}
