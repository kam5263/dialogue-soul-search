import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock } from 'lucide-react';

const PatternTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

  const [messageRatio, setMessageRatio] = useState<{ [key: string]: number }>({});
  const [responseTime, setResponseTime] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:9000/metrics')
      .then(res => {
        const data = res.data;
        setMessageRatio(data.message_ratio);
        setResponseTime(data.avg_reply_time);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('📛 metrics fetch error:', err);
        setIsLoading(false);
      });
  }, []);
  
  if (isLoading) {
    return <div className="p-6 text-center">📊 데이터를 불러오는 중입니다...</div>;
  }
  
  // Prepare message ratio data for pie chart
  const messageRatioData = [
    { name: user.name, value: messageRatio[user.name] ?? 0 },
    { name: partner.name, value: messageRatio[partner.name] ?? 0 }
  ];

  const userTime = responseTime[user.name] ?? 0;
  const partnerTime = responseTime[partner.name] ?? 0;
  
  const COLORS = ['#3B82F6', '#8B5CF6'];
  
  // Prepare time distribution data
  const timeDistributionData = data.timeDistribution.hours.map((hour, index) => ({
    hour,
    [user.name]: data.timeDistribution.user[index],
    [partner.name]: data.timeDistribution.partner[index]
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">대화 패턴 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Message Ratio Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">메시지 비율</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={messageRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {messageRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                {user.name}님이 전체 대화의 <strong>{data.messageRatio.user}%</strong>를,<br />
                {partner.name}님이 <strong>{data.messageRatio.partner}%</strong>를 차지하고 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Response Time Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">평균 응답 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <span className="block text-xl font-bold text-blue-600">{data.responseTime.user}분</span>
                  </div>
                </div>
                <p className="text-sm text-center">{user.name}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <span className="block text-xl font-bold text-purple-600">{data.responseTime.partner}분</span>
                  </div>
                </div>
                <p className="text-sm text-center">{partner.name}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">응답 패턴 분석</h4>
              {userTime < partnerTime ? (
                <p className="text-sm bg-blue-50 p-3 rounded">
                  {user.name}님이 {partner.name}님보다 평균 {(partnerTime - userTime).toFixed(1)}분 더 빠르게 응답하고 있습니다.
                </p>
              ) : userTime > partnerTime ? (
                <p className="text-sm bg-purple-50 p-3 rounded">
                  {partner.name}님이 {user.name}님보다 평균 {(userTime - partnerTime).toFixed(1)}분 더 빠르게 응답하고 있습니다.
                </p>
              ) : (
                <p className="text-sm bg-green-50 p-3 rounded">
                  두 사람의 응답 시간이 유사하여 대화의 호흡이 잘 맞는 것으로 보입니다.
                </p>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시간별 대화량</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeDistributionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={user.name} fill="#3B82F6" />
                <Bar dataKey={partner.name} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">시간별 대화 패턴 인사이트</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                {(() => {
                  // Find peak time for user
                  const userPeakHourIndex = data.timeDistribution.user.indexOf(
                    Math.max(...data.timeDistribution.user)
                  );
                  const userPeakHour = data.timeDistribution.hours[userPeakHourIndex];
                  
                  // Find peak time for partner
                  const partnerPeakHourIndex = data.timeDistribution.partner.indexOf(
                    Math.max(...data.timeDistribution.partner)
                  );
                  const partnerPeakHour = data.timeDistribution.hours[partnerPeakHourIndex];
                  
                  return (
                    <>
                      {user.name}님은 <strong>{userPeakHour}</strong>에 가장 활발하게 대화하고,
                      {partner.name}님은 <strong>{partnerPeakHour}</strong>에 가장 활발하게 대화합니다.
                      {userPeakHour === partnerPeakHour ? (
                        <span className="block mt-2 text-green-600">
                          두 사람의 대화 활동 시간이 일치하여 소통이 원활할 수 있습니다.
                        </span>
                      ) : (
                        <span className="block mt-2 text-amber-600">
                          두 사람의 활발한 대화 시간대가 다르므로, 중요한 대화는 서로의 활동 시간을 고려하여 계획하는 것이 좋습니다.
                        </span>
                      )}
                    </>
                  );
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternTab;
