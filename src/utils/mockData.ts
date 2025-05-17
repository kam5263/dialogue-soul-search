
import { AnalysisData, AppState } from '../types';

// Helper function to generate random number within range
const getRandomNumber = (min: number, max: number): number => {
  return +(Math.random() * (max - min) + min).toFixed(1);
};

// Helper function to generate arrays of random numbers
const generateRandomArray = (length: number, min: number, max: number): number[] => {
  return Array.from({ length }, () => getRandomNumber(min, max));
};

export const generateMockAnalysisData = (userInfo: AppState['userInfo']): AnalysisData => {
  const mbtiTypes = ['INFP', 'ENFP', 'INFJ', 'ENFJ', 'INTJ', 'ENTJ', 'INTP', 'ENTP', 'ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'];
  const timeHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const timestamps = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  
  // Get user's provided MBTI or generate a random one
  const userMbti = userInfo.user.mbti || mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];
  const partnerMbti = userInfo.partner.mbti || mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];
  
  // Topic colors
  const topicColors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
  
  // Generate topics
  const topicNames = ['일상', '취미', '감정', '계획', '음식', '영화/드라마', '업무/학업'];
  const topics = topicNames.slice(0, 6).map((name, index) => ({
    name,
    percentage: getRandomNumber(5, 30),
    color: topicColors[index],
  }));
  
  // Normalize topics percentages to sum up to 100
  const totalPercentage = topics.reduce((sum, topic) => sum + topic.percentage, 0);
  topics.forEach(topic => {
    topic.percentage = +(topic.percentage * 100 / totalPercentage).toFixed(1);
  });
  
  // Word frequency for word clouds
  const commonWords = [
    '안녕', '재미있다', '좋아', '그래', '오늘', '내일', '진짜', '맞아', '응', 
    '아니', '음식', '영화', '카페', '재미', '시간', '같이', '보고싶다', '사랑해',
    '고마워', '미안', '행복', '슬퍼', '배고파', '피곤해', '화나', '뭐해', '어디야'
  ];
  
  const userWords = commonWords.slice(0, 15).map(word => ({
    word,
    count: Math.floor(Math.random() * 50) + 10
  }));
  
  const partnerWords = commonWords.slice(5, 20).map(word => ({
    word,
    count: Math.floor(Math.random() * 50) + 10
  }));
  
  // Generate topic timeline data
  const topicTimeline = {
    timestamps,
    topics: {}
  };
  
  topics.forEach(topic => {
    topicTimeline.topics[topic.name] = generateRandomArray(timestamps.length, 0, 100);
  });
  
  // Generate emotion data
  const emotionNames = ['happiness', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
  const userEmotions: any = {};
  const partnerEmotions: any = {};
  
  emotionNames.forEach(emotion => {
    userEmotions[emotion] = getRandomNumber(0, 100);
    partnerEmotions[emotion] = getRandomNumber(0, 100);
  });
  
  // Generate emotion timeline
  const userEmotionTimeline: any = {};
  const partnerEmotionTimeline: any = {};
  
  emotionNames.forEach(emotion => {
    userEmotionTimeline[emotion] = generateRandomArray(timestamps.length, 0, 100);
    partnerEmotionTimeline[emotion] = generateRandomArray(timestamps.length, 0, 100);
  });
  
  return {
    // Personality analysis
    predictedMbti: {
      user: userMbti,
      partner: partnerMbti,
    },
    toneAnalysis: {
      user: {
        formal: getRandomNumber(0, 100),
        casual: getRandomNumber(0, 100),
        emotional: getRandomNumber(0, 100),
      },
      partner: {
        formal: getRandomNumber(0, 100),
        casual: getRandomNumber(0, 100),
        emotional: getRandomNumber(0, 100),
      },
    },
    emotionScores: {
      user: userEmotions,
      partner: partnerEmotions,
    },
    emotionTimeline: {
      timestamps,
      user: userEmotionTimeline,
      partner: partnerEmotionTimeline,
    },
    
    // Affinity analysis
    affinityScores: {
      user: getRandomNumber(50, 95),
      partner: getRandomNumber(50, 95),
    },
    pushPullIndex: {
      user: getRandomNumber(20, 80),
      partner: getRandomNumber(20, 80),
    },
    insights: {
      responsePatterns: '상대방이 메시지를 보낸 후 평균 5분 내에 응답하는 패턴을 보입니다.',
      optimalTimes: '오후 7시에서 9시 사이에 대화가 가장 활발하게 이루어집니다.',
      relationshipBalance: '대화의 주도권이 상대방에게 약간 더 있으며, 상대방이 대화를 이끌어가는 경향이 있습니다.',
    },
    
    // Conversation pattern analysis
    messageRatio: {
      user: getRandomNumber(30, 70),
      partner: getRandomNumber(30, 70),
    },
    responseTime: {
      user: getRandomNumber(1, 20),
      partner: getRandomNumber(1, 20),
    },
    timeDistribution: {
      hours: timeHours,
      user: generateRandomArray(24, 0, 100),
      partner: generateRandomArray(24, 0, 100),
    },
    
    // Content analysis
    wordFrequency: {
      user: userWords,
      partner: partnerWords,
    },
    topics,
    topicTimeline,
    
    // Summary and recommendations
    solutions: {
      timing: '소통이 가장 활발한 저녁 7시~9시에 중요한 대화를 나누세요.',
      actions: '상대방의 메시지에 감정적 공감을 표현하는 답장을 더 자주 보내보세요.',
      topics: '상대방이 관심 있어 하는 "영화/드라마" 주제로 대화를 시작해보세요.',
      responses: '질문을 통해 대화를 더 깊게 이어나가는 패턴을 시도해보세요.',
    },
    actionPlan: [
      '상대방의 메시지에 "그렇구나, 어떤 기분이 들었어?" 같은 감정 질문으로 대화를 확장해보세요.',
      '주말에 함께 볼 만한 영화나 드라마를 추천하며 대화를 시작해보세요.',
      '상대방이 보낸 메시지에 평소보다 15% 더 빠르게 답장하도록 노력해보세요.',
      '긍정적인 감정 표현(이모티콘, 칭찬)을 20% 더 늘려보세요.'
    ],
  };
};
