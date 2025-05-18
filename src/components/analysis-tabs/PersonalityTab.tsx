
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PersonalityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

  // Track selected emotions for the graph
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(["happiness", "sadness"]);

  // Toggle emotion selection for graph
  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  // Prepare radar chart data (emotion scores)
  const emotionRadarData = Object.keys(data.emotionScores.user).map(key => ({
    emotion: key === 'happiness' ? '행복' :
             key === 'sadness' ? '슬픔' :
             key === 'anger' ? '분노' :
             key === 'fear' ? '두려움' :
             key === 'surprise' ? '놀람' :
             key === 'disgust' ? '혐오' : '중립',
    [user.name]: data.emotionScores.user[key as keyof typeof data.emotionScores.user],
    [partner.name]: data.emotionScores.partner[key as keyof typeof data.emotionScores.partner],
  }));

  // Prepare line chart data (emotion timeline)
  const emotionTimelineData = data.emotionTimeline.timestamps.map((time, index) => {
    const dataPoint: any = { name: time };
    
    // Add user data
    Object.keys(data.emotionTimeline.user).forEach(emotion => {
      dataPoint[`${user.name}-${emotion}`] = 
        data.emotionTimeline.user[emotion as keyof typeof data.emotionTimeline.user][index];
    });
    
    // Add partner data
    Object.keys(data.emotionTimeline.partner).forEach(emotion => {
      dataPoint[`${partner.name}-${emotion}`] = 
        data.emotionTimeline.partner[emotion as keyof typeof data.emotionTimeline.partner][index];
    });
    
    return dataPoint;
  });

  // Function to get MBTI comparison text
  const getMbtiComparisonText = (person: 'user' | 'partner') => {
    const personData = person === 'user' ? user : partner;
    const predictedMbti = person === 'user' ? data.predictedMbti.user : data.predictedMbti.partner;
    
    if (personData.mbti && personData.mbti !== predictedMbti) {
      return `(입력: ${personData.mbti})`;
    }
    return '';
  };
  
  // Colors for the emotion lines
  const emotionColors = {
    happiness: '#10B981', // green
    sadness: '#6B7280',  // gray
    anger: '#EF4444',    // red
    fear: '#8B5CF6',     // purple
    surprise: '#F59E0B', // amber
    disgust: '#7C3AED',  // violet
    neutral: '#3B82F6',  // blue
  };

  // Speech style traits for each person
  const speechTraits = {
    user: [
      { trait: '친근함', level: 78 },
      { trait: '유머러스', level: 62 },
      { trait: '솔직함', level: 85 },
      { trait: '공감적', level: 70 },
      { trait: '논리적', level: 68 },
    ],
    partner: [
      { trait: '친근함', level: 65 },
      { trait: '유머러스', level: 72 },
      { trait: '솔직함', level: 70 },
      { trait: '공감적', level: 82 },
      { trait: '논리적', level: 75 },
    ]
  };

  // Map of emotion keys to Korean labels
  const emotionLabels = {
    happiness: '행복',
    sadness: '슬픔',
    anger: '분노',
    fear: '두려움',
    surprise: '놀람',
    disgust: '혐오',
    neutral: '중립'
  };

  // Function to determine badge size based on trait level
  const getTraitBadgeSize = (level: number) => {
    if (level >= 80) return 'lg';
    if (level >= 60) return 'md';
    return 'sm';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">성향 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* MBTI Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MBTI 예측</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">{user.name}</p>
                <div className="text-2xl font-bold text-blue-700">{data.predictedMbti.user}</div>
                <p className="text-xs text-gray-500">{getMbtiComparisonText('user')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">{partner.name}</p>
                <div className="text-2xl font-bold text-purple-700">{data.predictedMbti.partner}</div>
                <p className="text-xs text-gray-500">{getMbtiComparisonText('partner')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speech Style Analysis Card - New format with badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">말투 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-blue-700">{user.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {speechTraits.user.map(trait => (
                    <Badge 
                      key={trait.trait}
                      className={`px-3 py-1.5 ${
                        trait.level >= 80 ? 'bg-blue-500 text-white' :
                        trait.level >= 60 ? 'bg-blue-200 text-blue-800' : 
                        'bg-blue-100 text-blue-600'
                      } text-${getTraitBadgeSize(trait.level)}`}
                    >
                      {trait.trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-purple-700">{partner.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {speechTraits.partner.map(trait => (
                    <Badge 
                      key={trait.trait}
                      className={`px-3 py-1.5 ${
                        trait.level >= 80 ? 'bg-purple-500 text-white' :
                        trait.level >= 60 ? 'bg-purple-200 text-purple-800' : 
                        'bg-purple-100 text-purple-600'
                      } text-${getTraitBadgeSize(trait.level)}`}
                    >
                      {trait.trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spider Chart (Emotion Radar) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">감정 성향 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={emotionRadarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emotion" />
                <Radar
                  name={user.name}
                  dataKey={user.name}
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
                <Radar
                  name={partner.name}
                  dataKey={partner.name}
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.5}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Timeline with Selectable Emotions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">감정 변화 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">감정을 선택하여 변화 추이를 확인하세요 (다중 선택 가능)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(emotionLabels).map(([emotion, label]) => (
                <Button 
                  key={emotion}
                  variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEmotion(emotion)}
                  style={{ 
                    backgroundColor: selectedEmotions.includes(emotion) 
                      ? emotionColors[emotion as keyof typeof emotionColors] 
                      : 'transparent',
                    borderColor: emotionColors[emotion as keyof typeof emotionColors],
                    color: selectedEmotions.includes(emotion) ? 'white' : emotionColors[emotion as keyof typeof emotionColors]
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={emotionTimelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Only show selected emotions */}
                {selectedEmotions.map(emotion => (
                  <React.Fragment key={emotion}>
                    <Line 
                      type="monotone" 
                      dataKey={`${user.name}-${emotion}`} 
                      name={`${user.name} (${emotionLabels[emotion as keyof typeof emotionLabels]})`}
                      stroke={emotionColors[emotion as keyof typeof emotionColors]} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey={`${partner.name}-${emotion}`} 
                      name={`${partner.name} (${emotionLabels[emotion as keyof typeof emotionLabels]})`}
                      stroke={emotionColors[emotion as keyof typeof emotionColors]} 
                      strokeDasharray="5 5" 
                    />
                  </React.Fragment>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityTab;
