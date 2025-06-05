import React, { useMemo } from 'react';

interface Props {
    leftWords: { word: string; count: number }[];
    rightWords: { word: string; count: number }[];
}

const WordCloudHeart: React.FC<Props> = ({ leftWords, rightWords }) => {
    const baseWords = [...leftWords, ...rightWords].map((w, i) => ({
        ...w,
        owner: i < leftWords.length ? 'user' : 'partner' as 'user' | 'partner',
    }));

    // 단어 반복으로 밀도 확보
    const repeatedWords = [...baseWords, ...baseWords, ...baseWords];

    const allWords = useMemo(
        () => repeatedWords.sort(() => Math.random() - 0.5),
        [repeatedWords]
    );

    // ❤️ 하트 곡선 (t ∈ [0, 2])
    const heartPath = (t: number, scale = 15) => {
        const theta = Math.PI * t; // t가 0~2면 theta는 0~2π
        const x = 16 * Math.pow(Math.sin(theta), 3);
        const y =
            13 * Math.cos(theta) -
            5 * Math.cos(2 * theta) -
            2 * Math.cos(3 * theta) -
            Math.cos(4 * theta);
        return {
            x: x * scale + 300,
            y: -y * scale + 300,
        };
    };

    // 🌀 단어 위치 샘플링
    const total = allWords.length;
    const outer = Array.from({ length: total / 2 }, (_, i) => heartPath(i / (total / 2) * 2, 15));
    const inner = Array.from({ length: total / 2 }, (_, i) => heartPath(i / (total / 2) * 2, 11));
    const positions = [...outer, ...inner]; // 두 겹

    return (
        <div className="relative w-[600px] h-[600px] mx-auto">
            {allWords.map((w, i) => {
                const { x, y } = positions[i % positions.length];
                const fontSize = 10 + w.count * 0.4;
                const colorClass =
                    w.owner === 'user'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700';

                return (
                    <span
                        key={`${w.word}-${i}`}
                        className={`absolute px-2 py-1 rounded-full shadow text-xs font-medium whitespace-nowrap ${colorClass}`}
                        style={{
                            top: `${y}px`,
                            left: `${x}px`,
                            transform: 'translate(-50%, -50%)',
                            fontSize: `${fontSize}px`,
                        }}
                    >
                        {w.word}
                    </span>
                );
            })}
        </div>
    );
};

export default WordCloudHeart;
