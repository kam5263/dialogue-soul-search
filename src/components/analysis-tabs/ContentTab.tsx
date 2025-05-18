
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Word cloud component with better visualization
const WordCloud = ({ words }: { words: { word: string; count: number }[] }) => {
  // Sort words by count
  const sortedWords = [...words].sort((a, b) => b.count - a.count);
  const maxCount = sortedWords[0]?.count || 1;
  
  // Calculate font size and position words in a more natural cloud layout
  const getRandomPosition = () => {
    return {
      x: Math.floor(Math.random() * 70) + 15, // 15-85% of container width
      y: Math.floor(Math.random() * 70) + 15, // 15-85% of container height
      rotate: Math.floor(Math.random() * 60) - 30, // -30 to 30 degrees
    };
  };
  
  // Random colors for words
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // green
    '#6366F1', // indigo
    '#EF4444', // red
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 40;
    // Calculate size based on word frequency
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  return (
    <div className="relative h-64 w-full bg-gray-50 rounded-lg p-2 overflow-hidden">
      {sortedWords.map((item, index) => {
        const { x, y, rotate } = getRandomPosition();
        const fontSize = getFontSize(item.count);
        
        return (
          <div
            key={`${item.word}-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${fontSize}px`,
              fontWeight: fontSize > 20 ? 'bold' : 'normal',
              color: getRandomColor(),
              transform: `rotate(${rotate}deg)`,
              opacity: 0.7 + (item.count / maxCount) * 0.3,
              transition: 'all 0.3s ease',
              zIndex: Math.floor(fontSize),
            }}
          >
            {item.word}
          </div>
        );
      })}
    </div>
  );
};

const ContentTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;
  
  // Prepare topic timeline data
  const topicNames = Object.keys(data.topicTimeline.topics);
  const topicTimelineData = data.topicTimeline.timestamps.map((timestamp, index) => {
    const point: any = { name: timestamp };
    
    topicNames.forEach(topic => {
      point[topic] = data.topicTimeline.topics[topic][index];
    });
    
    return point;
  });
  
  // Colors for topics in the pie chart
  const COLORS = data.topics.map(topic => topic.color);
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">대화 내용 분석</h2>
      
      {/* Word Frequency with Word Cloud */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">자주 사용한 단어</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user">
            <TabsList className="mb-4">
              <TabsTrigger value="user">{user.name}</TabsTrigger>
              <TabsTrigger value="partner">{partner.name}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <WordCloud words={data.wordFrequency.user} />
            </TabsContent>
            
            <TabsContent value="partner">
              <WordCloud words={data.wordFrequency.partner} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">단어 사용 인사이트</h4>
            <p className="text-sm text-gray-600">
              {user.name}님은 주로 
              <span className="font-medium text-blue-600">{` ${data.wordFrequency.user.slice(0, 3).map(w => w.word).join(', ')} `}</span>
              등의 단어를 자주 사용하고, 
              {partner.name}님은 
              <span className="font-medium text-purple-600">{` ${data.wordFrequency.partner.slice(0, 3).map(w => w.word).join(', ')} `}</span>
              등의 단어를 자주 사용합니다. 
              이는 각자의 관심사와 대화 스타일을 반영합니다.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Topic Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Topic Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">주요 대화 주제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data.topics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                대화의 가장 큰 비중을 차지하는 주제는 
                <span className="font-medium" style={{ color: data.topics[0].color }}>
                  {` ${data.topics[0].name} (${data.topics[0].percentage}%)`}
                </span>
                입니다.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Topic Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">시간에 따른 주제 변화</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={topicTimelineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {topicNames.slice(0, 3).map((topic, index) => (
                    <Line
                      key={topic}
                      type="monotone"
                      dataKey={topic}
                      stroke={data.topics.find(t => t.name === topic)?.color || COLORS[index % COLORS.length]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                주제별 대화 비중은 시간에 따라 변화하며, 최근에는 
                <span className="font-medium" style={{ 
                  color: data.topics.find(
                    t => t.name === topicNames[
                      Object.values(topicTimelineData[topicTimelineData.length - 1])
                        .indexOf(Math.max(...Object.values(topicTimelineData[topicTimelineData.length - 1])
                        .filter((v): v is number => typeof v === 'number')))
                    ]
                  )?.color 
                }}>
                  {` ${topicNames[
                    Object.values(topicTimelineData[topicTimelineData.length - 1])
                      .indexOf(Math.max(...Object.values(topicTimelineData[topicTimelineData.length - 1])
                      .filter((v): v is number => typeof v === 'number')))
                  ]} `}
                </span>
                주제가 많이 언급되고 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overall Content Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">대화 내용 총평</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-4">
              두 사람의 대화는 주로 
              <span className="font-medium text-blue-600">{` ${data.topics.slice(0, 3).map(t => t.name).join(', ')} `}</span>
              주제를 중심으로 이루어집니다. 
            </p>
            
            <p>
              {user.name}님은 
              <span className="font-medium text-blue-600">{` ${data.wordFrequency.user[0].word} `}</span>
              단어를 가장 자주 사용하고, 
              {partner.name}님은 
              <span className="font-medium text-purple-600">{` ${data.wordFrequency.partner[0].word} `}</span>
              단어를 가장 자주 사용합니다. 
              이는 각자의 성격과 소통 방식을 반영합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
