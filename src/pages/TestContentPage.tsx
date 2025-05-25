import React, { useEffect } from 'react';
import ContentTab from '@/components/analysis-tabs/ContentTab';
import { AppProvider, useApp } from '@/contexts/AppContext';

const DummyDataWrapper = () => {
    const { setUserInfo, setAnalysisData } = useApp();

    useEffect(() => {
        setUserInfo('user', { name: '테스트', mbti: 'INFP', gender: '여' });
        setUserInfo('partner', { name: '동녕', mbti: 'ENTJ', gender: '남' });

        const rawJson = {
            word_frequency: [
                { rank: 1, word: '오늘', count: 34 },
                { rank: 2, word: '진짜', count: 30 },
                { rank: 3, word: '테스트', count: 21 },
                { rank: 4, word: '사진', count: 21 },
                { rank: 5, word: '언니', count: 18 },
                { rank: 6, word: '하나', count: 16 },
                { rank: 7, word: '사람', count: 16 },
                { rank: 8, word: '이모티콘', count: 15 },
                { rank: 9, word: '우리', count: 14 },
                { rank: 10, word: '수업', count: 12 }
            ]
        };

        const half = Math.ceil(rawJson.word_frequency.length / 2);

        const transformed = {
            wordFrequency: {
                user: rawJson.word_frequency.slice(0, half).map(({ word, count }) => ({ word, count })),
                partner: rawJson.word_frequency.slice(half).map(({ word, count }) => ({ word, count }))
            },
            topics: [
                { name: '일상', percentage: 0.4, color: '#3B82F6' },
                { name: '감정', percentage: 0.3, color: '#EF4444' },
                { name: '취미', percentage: 0.3, color: '#6366F1' }
            ],
            topicTimeline: {
                timestamps: ['월', '화', '수', '목', '금', '토', '일'],
                topics: {
                    일상: [10, 20, 15, 30, 25, 10, 5],
                    감정: [5, 10, 20, 15, 10, 30, 40],
                    취미: [10, 5, 10, 15, 20, 25, 30]
                }
            }
        };

        setAnalysisData(transformed);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ContentTab />
        </div>
    );
};

const TestContentPage: React.FC = () => {
    return (
        <AppProvider>
            <DummyDataWrapper />
        </AppProvider>
    );
};

export default TestContentPage;
