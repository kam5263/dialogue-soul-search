import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PersonalityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

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

  // Translating tone variables to Korean
  const toneLabels = {
    formal: '격식체',
    casual: '구어체',
    emotional: '감정적'
  };

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

        {/* Tone Analysis Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">말투 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(toneLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="text-gray-500">
                      {user.name}: {data.toneAnalysis.user[key as keyof typeof data.toneAnalysis.user]}% / 
                      {partner.name}: {data.toneAnalysis.partner[key as keyof typeof data.toneAnalysis.partner]}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${data.toneAnalysis.user[key as keyof typeof data.toneAnalysis.user]}%` }}
                    ></div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${data.toneAnalysis.partner[key as keyof typeof data.toneAnalysis.partner]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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

      {/* Emotion Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">감정 변화 추이</CardTitle>
        </CardHeader>
        <CardContent>
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
                {/* Only show happiness and sadness by default to keep it clean */}
                <Line 
                  type="monotone" 
                  dataKey={`${user.name}-happiness`} 
                  name={`${user.name} (행복)`}
                  stroke={emotionColors.happiness} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey={`${partner.name}-happiness`} 
                  name={`${partner.name} (행복)`}
                  stroke={emotionColors.happiness} 
                  strokeDasharray="5 5" 
                />
                <Line 
                  type="monotone" 
                  dataKey={`${user.name}-sadness`} 
                  name={`${user.name} (슬픔)`}
                  stroke={emotionColors.sadness} 
                />
                <Line 
                  type="monotone" 
                  dataKey={`${partner.name}-sadness`} 
                  name={`${partner.name} (슬픔)`}
                  stroke={emotionColors.sadness} 
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityTab;
