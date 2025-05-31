
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const allTraits = ['친근함', '유머러스', '솔직함', '공감적', '논리적'];

const PersonalityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const predict = data.mbti_prediction.predict;
  const predictedAnalysis = data.chemistry_analysis.find(item => item.analysis_type === "predicted");

  const { user, partner } = state.userInfo;
  //Tone
  const [speechTraits, setSpeechTraits] = useState<any | null>(null);
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

  const getGradientStyle = (value, speaker) => {
    const intensity = Math.max(0.1, value / 100);
    if (speaker === user.name) {
      return {
        background: `linear-gradient(135deg, rgba(99, 102, 241, ${intensity}) 0%, rgba(168, 85, 247, ${intensity * 0.8}) 100%)`,
        boxShadow: `0 4px 20px rgba(99, 102, 241, ${intensity * 0.3})`
      };
    } else {
      return {
        background: `linear-gradient(135deg, rgba(16, 185, 129, ${intensity}) 0%, rgba(5, 150, 105, ${intensity * 0.8}) 100%)`,
        boxShadow: `0 4px 20px rgba(16, 185, 129, ${intensity * 0.3})`
      };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        //const nlpResult = await fetchEmotionAnalysis('sample');
        //const messages = nlpResult.result.messages;
        // const dateEmotionMap: Record<string, Record<string, number[]>> = {};
        // messages.forEach((msg: any) => {
        //   const date = dayjs(msg.timestamp).format('YYYY-MM-DD');
        //   if (!dateEmotionMap[date]) dateEmotionMap[date] = {};
        //   if (!dateEmotionMap[date][msg.sentiment]) dateEmotionMap[date][msg.sentiment] = [];

        //   dateEmotionMap[date][msg.sentiment].push(msg.confidence);
        // });

        // 평균값 계산 후 LineChart에 넣을 데이터 생성
        // const timeline = Object.entries(dateEmotionMap).map(([date, sentiments]) => {
        //   const dataPoint: any = { name: date };

        //   Object.entries(sentiments).forEach(([emotion, confidences]) => {
        //     const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
        //     dataPoint[emotion] = parseFloat(avgConfidence.toFixed(3)); // 소수점 3자리로
        //   });

        //   return dataPoint;
        // });

        // 메시지에서 감정 키 자동 추출
        //const emotions = Array.from(new Set(messages.map(msg => msg.sentiment))) as string[];

        //한글 감정명 그대로 라벨로 사용
        // const labels: Record<string, string> = {};
        // emotions.forEach(emotion => {
        //   labels[emotion as string] = emotion as string; // 예: "즐거운(신나는)": "즐거운(신나는)"
        // });
        
        const generateTraitList = (selectedTrait) =>
          allTraits.map((trait) => ({
            trait,
            selected: trait === selectedTrait,
        }));

        setSpeechTraits({
          user: generateTraitList(data.conversational_tone.user),
          partner: generateTraitList(data.conversational_tone.partner),
        });

        //setEmotionData(nlpResult.result);
        //setEmotionTimelineData(timeline);
        //setUniqueEmotions(emotions);
        //setEmotionLabels(labels);
        //setSelectedEmotions(emotions);
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

  // if (!emotionData || emotionTimelineData.length === 0) {
  //   return <div className="p-6 text-center text-red-500">데이터를 불러올 수 없습니다.</div>;
  // }

  // const emotionRadarData = Object.entries(emotionData.average_confidence).map(([key, value]) => ({
  //   emotion: key,
  //   [user.name]: value,
  //   [partner.name]: Math.random() * 0.5 + 0.3, // 파트너 데이터가 없다면 예시값
  // }));

  // // Colors for the emotion lines
  // const emotionColors = {
  //   "즐거운(신나는)": '#10B981',
  //   "설레는(기대하는)": '#F59E0B',
  //   "일상적인": '#6B7280',
  //   "기쁨(행복한)": '#3B82F6',
  // };

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

  // Function to determine badge size based on trait level
  const getTraitBadgeSize = (selected: boolean) => {
    if (selected) return 'lg';
    return 'sm';
  };

  // 아주 간단한 버전, 실제론 MBTI 궁합표 기반으로 더 디테일하게 가능
const getCompatibilityPercentage = (my: string, partner: string): number => {
  if (!my || !partner) return 0;
  // 같은 유형이면 높게
  if (my === partner) return 90;
  if (my[0] === partner[0]) return 80;
  return Math.floor(50 + Math.random() * 30); // 50~80% 랜덤
};

const getCompatibilityComment = (my: string, partner: string): string => {
  if (!my || !partner) return 'MBTI 정보가 부족하여 분석할 수 없습니다.';
  if (my === partner) return '성향이 아주 잘 맞는 편이에요!';
  if (my[0] !== partner[0]) return '성격 차이가 있지만 서로에게 신선할 수 있어요!';
  return '비슷한 점이 많아 무난한 조합입니다.';
};

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-6">성향 분석</h2>       */}
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">😃 선택한 MBTI</CardTitle>
            </CardHeader>        
            <CardContent>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">{user.name}의 MBTI</div>
                    {/* <div className="text-xl font-bold text-indigo-600">{user.mbti}</div> */}
                    <div 
                      className="className=group/item relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                      style={getGradientStyle(50, user.name)}
                      >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="relative p-6 text-center text-2xl font-bold">{user.mbti}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">{partner.name}의 MBTI</div>
                    <div 
                      className="className=group/item relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                      style={getGradientStyle(40, partner.name)}
                      >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="relative p-6 text-center text-2xl font-bold">{partner.mbti}</div>
                    </div>
                  </div>
                </div>
              </div>  
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">😎 분석한 MBTI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex flex-col justify-between h-full bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8 text-center">
              <div className="absolute top-4 right-4">
                <div className="text-white px-3 py-1 rounded-full text-xs font-semibold shadow" style={getGradientStyle(80, user.name)}>
                  정확도 {predict.confidence}
                </div>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center flex-grow">
                <div className="text-indigo-700 font-semibold text-sm">
                  {predictedAnalysis.character_info.partner.type}
                </div>
                <div className="text-4xl font-bold text-indigo-500 mb-1">
                  {predict.type}
                </div>
                <div className={`text-sm font-medium ${partner.mbti === predict.type ? 'text-emerald-700' : 'text-red-500'}`}>
                  {partner.mbti === predict.type ? '✓ 입력값과 일치' : '⚠️ 입력한 MBTI와 차이가 있어요'}
                </div>
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">💞 MBTI 케미 분석</CardTitle>
      </CardHeader>
      <CardContent>       
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xl font-bold">{predictedAnalysis.score_summary.replace(/\*\*/g, "")}</div>
          </div>
        <div className="text-sm opacity-90">
        {/* <ReactMarkdown>{predictedAnalysis.score_summary}</ReactMarkdown> <br></br> */}
        <ReactMarkdown>{predictedAnalysis.chemistry_description}</ReactMarkdown> <br></br>
        <ReactMarkdown>{predictedAnalysis.warning_signal}</ReactMarkdown>
        </div>
      </div>
      </CardContent>
    </Card>

    {/* Speech Style Analysis Card - New format with badges */}
    {<Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">📣 말투 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500">{user.name}</h3>
            <div className="flex flex-wrap gap-2">
              {speechTraits.user.map(trait => (
                <Badge 
                  key={trait.trait}
                  className={`px-3 py-1.5 ${
                    trait.selected ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg border border-indigo-400/50 transform scale-105' :                        
                    'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 border border-indigo-200/50 hover:from-indigo-100 hover:to-indigo-150'
                  } text-${getTraitBadgeSize(trait.selected)}`}
                >
                  {trait.trait}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500">{partner.name}</h3>
            <div className="flex flex-wrap gap-2">
              {speechTraits.partner.map(trait => (
                <Badge 
                  key={trait.trait}
                  className={`px-3 py-1.5 ${
                    trait.selected ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg border border-emerald-400/50 transform scale-105' :                        
                    'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 border border-emerald-200/50 hover:from-emerald-100 hover:to-emerald-150'
                  } text-${getTraitBadgeSize(trait.selected)}`}
                >
                  {trait.trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>}
  </div>

      {/* Spider Chart (Emotion Radar) */}
      {/* <Card className="mb-6">
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
      </Card> */}

      {/* Emotion Timeline with Selectable Emotions */}
      {/* <Card>
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
                {selectedEmotions.map(emotion => (
                  <React.Fragment key={emotion}>                    
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
      </Card> */}
    </div>
  );
};

export default PersonalityTab;
