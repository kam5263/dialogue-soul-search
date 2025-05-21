
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchEmotionAnalysis, fetchLLM } from '@/api/analysis'; // 위에서 만든 API 함수
import { parseJsonData } from '@/utils/parser'
import dayjs from 'dayjs';

const allTraits = ['친근함', '유머러스', '솔직함', '공감적', '논리적'];

const PersonalityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;
  //MBTI
  const [finalMbti, setFinalMbti] = useState('');
  const [confidence, setConfidence] = useState('');
  const [comment, setComment] = useState('');
  //Tone
  const [speechTraits, setSpeechTraits] = useState({
    user: [],
    partner: [],
  });

  const [emotionData, setEmotionData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Track selected emotions for the graph
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(["happiness", "sadness"]);

  const [emotionTimelineData, setEmotionTimelineData] = useState<any[]>([]);
  const [emotionLabels, setEmotionLabels] = useState<Record<string, string>>({});
  const [uniqueEmotions, setUniqueEmotions] = useState<string[]>([]);

  // Toggle emotion selection for graph
  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const nlpResult = await fetchEmotionAnalysis('gpt_dead_love_sample_30.csv');
        const llmResult = await fetchLLM('kakao_sample');

        const messages = nlpResult.result.messages;
        const dateEmotionMap: Record<string, Record<string, number[]>> = {};
        messages.forEach((msg: any) => {
          const date = dayjs(msg.timestamp).format('YYYY-MM-DD');
          if (!dateEmotionMap[date]) dateEmotionMap[date] = {};
          if (!dateEmotionMap[date][msg.sentiment]) dateEmotionMap[date][msg.sentiment] = [];

          dateEmotionMap[date][msg.sentiment].push(msg.confidence);
        });

        // 평균값 계산 후 LineChart에 넣을 데이터 생성
        const timeline = Object.entries(dateEmotionMap).map(([date, sentiments]) => {
          const dataPoint: any = { name: date };

          Object.entries(sentiments).forEach(([emotion, confidences]) => {
            const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
            dataPoint[emotion] = parseFloat(avgConfidence.toFixed(3)); // 소수점 3자리로
          });

          return dataPoint;
        });

        // 메시지에서 감정 키 자동 추출
        const emotions = Array.from(new Set(messages.map(msg => msg.sentiment))) as string[];

        // 한글 감정명 그대로 라벨로 사용
        const labels: Record<string, string> = {};
        emotions.forEach(emotion => {
          labels[emotion as string] = emotion as string; // 예: "즐거운(신나는)": "즐거운(신나는)"
        });
        
        //MBTI start//
        const llmData = parseJsonData(llmResult.result);
        const partnerMbtiDetail = llmData.mbti_prediction;
        setFinalMbti(partnerMbtiDetail.type);
        setConfidence(partnerMbtiDetail.confidence);
        setComment(partnerMbtiDetail.mbti_commemts);
        //MBTI end//
        const { user, partener } = llmData.convalsational_tone;
        const generateTraitList = (selectedTrait) =>
          allTraits.map((trait) => ({
            trait,
            selected: trait === selectedTrait,
        }));

        setSpeechTraits({
          user: generateTraitList(user),
          partner: generateTraitList(partener),
        });

        setEmotionData(nlpResult.result);
        setEmotionTimelineData(timeline);
        setUniqueEmotions(emotions);
        setEmotionLabels(labels);
        setSelectedEmotions(emotions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  }

  if (!emotionData || emotionTimelineData.length === 0) {
    return <div className="p-6 text-center text-red-500">데이터를 불러올 수 없습니다.</div>;
  }
  const emotionRadarData = Object.entries(emotionData.average_confidence).map(([key, value]) => ({
    emotion: key,
    [user.name]: value,
    [partner.name]: Math.random() * 0.5 + 0.3, // 파트너 데이터가 없다면 예시값
  }));

  // Colors for the emotion lines
  const emotionColors = {
    "즐거운(신나는)": '#10B981',
    "설레는(기대하는)": '#F59E0B',
    "일상적인": '#6B7280',
    "기쁨(행복한)": '#3B82F6',
  };

  // Prepare line chart data (emotion timeline)
  // const emotionTimelineData = data.emotionTimeline.timestamps.map((time, index) => {
  //   const dataPoint: any = { name: time };
    
  //   // Add user data
  //   Object.keys(data.emotionTimeline.user).forEach(emotion => {
  //     dataPoint[`${user.name}-${emotion}`] = 
  //       data.emotionTimeline.user[emotion as keyof typeof data.emotionTimeline.user][index];
  //   });
    
  //   // Add partner data
  //   Object.keys(data.emotionTimeline.partner).forEach(emotion => {
  //     dataPoint[`${partner.name}-${emotion}`] = 
  //       data.emotionTimeline.partner[emotion as keyof typeof data.emotionTimeline.partner][index];
  //   });
    
  //   return dataPoint;
  // });

  // Function to get MBTI comparison text
  const getMbtiComparisonText = (person: 'user' | 'partner') => {
    const personData = person === 'user' ? user : partner;
    const predictedMbti = person === 'user' ? data.predictedMbti.user : data.predictedMbti.partner;
    
    if (personData.mbti && personData.mbti !== predictedMbti) {
      return `(입력: ${personData.mbti})`;
    }
    return '';
  };

  // Function to determine badge size based on trait level
  const getTraitBadgeSize = (selected: boolean) => {
    if (selected) return 'lg';
    return 'sm';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">성향 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MBTI 예측</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* 나의 MBTI */}
              <div className="col-span-2 bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">{user.name}</p>
                <div className="text-lg font-bold text-blue-700">INTP</div>
              </div>

              {/* 상대방 MBTI 예측 */}
              <div className="col-span-3 bg-purple-50 p-4 rounded-lg text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">{partner.name}</p>
                <div className="text-3xl font-bold text-purple-700 mb-1">{finalMbti}</div>
                <p className="text-xs text-gray-600">정확도 {confidence}</p>
              </div>
            </div>

            {/* 분석 코멘트 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              {comment}
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
                        trait.selected ? 'bg-blue-500 text-white' :                        
                        'bg-blue-100 text-blue-600'
                      } text-${getTraitBadgeSize(trait.selected)}`}
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
                        trait.selected ? 'bg-purple-500 text-white' : 
                        'bg-purple-100 text-purple-600'
                      } text-${getTraitBadgeSize(trait.selected)}`}
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
                    {/* <Line 
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
                    /> */}
                    {selectedEmotions.map(emotion => (
                      <Line 
                        key={emotion}
                        type="monotone"
                        dataKey={emotion}
                        name={emotionLabels[emotion as keyof typeof emotionLabels] || emotion}
                        stroke={emotionColors[emotion as keyof typeof emotionColors] || '#3B82F6'}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    ))}
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
