
// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useApp } from '@/contexts/AppContext';
// import { ChevronLeft } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// const mbtiOptions = [
//   'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
//   'ISTP', 'ISFP', 'INFP', 'INTP',
//   'ESTP', 'ESFP', 'ENFP', 'ENTP',
//   'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
// ];

// const UserInfoPage: React.FC = () => {
//   const { state, setUserInfo, goToStep, startAnalysis } = useApp();
//   const { toast } = useToast();
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate user names (required)
//     if (!state.userInfo.user.name.trim()) {
//       toast({
//         title: "입력 오류",
//         description: "사용자 이름을 입력해주세요.",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (!state.userInfo.partner.name.trim()) {
//       toast({
//         title: "입력 오류",
//         description: "상대방 이름을 입력해주세요.",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     // Start the analysis
//     startAnalysis();
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
//       <Card className="w-full max-w-md p-6 shadow-card">
//         <div className="flex items-center mb-6">
//           <Button 
//             variant="ghost" 
//             size="icon"
//             onClick={() => goToStep('upload')}
//             className="mr-2"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-bold">사용자 정보 입력</h1>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {/* User Section */}
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h2 className="text-lg font-medium mb-3 text-blue-800">나의 정보</h2>
              
//               <div className="space-y-3">
//                 <div>
//                   <Label htmlFor="userName">이름 (필수)</Label>
//                   <Input
//                     id="userName"
//                     placeholder="사용자 이름"
//                     value={state.userInfo.user.name}
//                     onChange={(e) => setUserInfo('user', { name: e.target.value })}
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label htmlFor="userMbti">MBTI (선택)</Label>
//                     <Select
//                       value={state.userInfo.user.mbti || ""}
//                       onValueChange={(value) => setUserInfo('user', { mbti: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="선택" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">선택 안함</SelectItem>
//                         {mbtiOptions.map((option) => (
//                           <SelectItem key={option} value={option}>{option}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   <div>
//                     <Label htmlFor="userGender">성별 (선택)</Label>
//                     <Select
//                       value={state.userInfo.user.gender || ""}
//                       onValueChange={(value: any) => setUserInfo('user', { gender: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="선택" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">선택 안함</SelectItem>
//                         <SelectItem value="male">남성</SelectItem>
//                         <SelectItem value="female">여성</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Partner Section */}
//             <div className="bg-purple-50 p-4 rounded-lg">
//               <h2 className="text-lg font-medium mb-3 text-purple-800">상대방 정보</h2>
              
//               <div className="space-y-3">
//                 <div>
//                   <Label htmlFor="partnerName">이름 (필수)</Label>
//                   <Input
//                     id="partnerName"
//                     placeholder="상대방 이름"
//                     value={state.userInfo.partner.name}
//                     onChange={(e) => setUserInfo('partner', { name: e.target.value })}
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label htmlFor="partnerMbti">MBTI (선택)</Label>
//                     <Select
//                       value={state.userInfo.partner.mbti || ""}
//                       onValueChange={(value) => setUserInfo('partner', { mbti: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="선택" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">선택 안함</SelectItem>
//                         {mbtiOptions.map((option) => (
//                           <SelectItem key={option} value={option}>{option}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   <div>
//                     <Label htmlFor="partnerGender">성별 (선택)</Label>
//                     <Select
//                       value={state.userInfo.partner.gender || ""}
//                       onValueChange={(value: any) => setUserInfo('partner', { gender: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="선택" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">선택 안함</SelectItem>
//                         <SelectItem value="male">남성</SelectItem>
//                         <SelectItem value="female">여성</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <Button type="submit" className="w-full" disabled={state.isAnalyzing}>
//               {state.isAnalyzing ? '분석중...' : '분석하기'}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default UserInfoPage;
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from "@/components/ui/button";
import { API_URL } from '@/config.js';

interface Props {
    uploadedFile: File | null;
}

const UserInfoPage: React.FC<Props> = ({ uploadedFile }) => {
    const { state, goToStep, setUserInfo, startAnalysis } = useApp();
    const [selected, setSelected] = useState(null);

    const [showToast, setShowToast] = useState(false);

    // 사용자 정보 상태
    const [myMbti, setMyMbti] = useState('');
    const [myGender, setMyGender] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [partnerMbti, setPartnerMbti] = useState('');
    const [partnerGender, setPartnerGender] = useState('');

    useEffect(() => {
        if (uploadedFile) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadedFile]);
    const handleSelect = (name) => {
        const other = state.predictedSpeakers.find((n) => n !== name);
        setSelected(name);        
    };
    const handleAnalyze = async () => {
        const myName = selected;
        const partnerName = state.predictedSpeakers.find((n) => n !== myName);

        if (!uploadedFile || !myName || !partnerName) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('my_name', myName);
        formData.append('my_mbti', myMbti);
        formData.append('my_gender', myGender);
        formData.append('partner_name', partnerName);
        formData.append('partner_mbti', partnerMbti);
        formData.append('partner_gender', partnerGender);
        formData.append('filename', state.fileName);

        try {
            //server에 POST 요청 파이썬 Flask 서버
            const res = await fetch(API_URL + '/analyze', {
                method: 'POST',
                body: formData, //파일 + 사용자정보
            });

            const data = await res.json();
            console.log('서버 응답:', data);
            
            setUserInfo('user', {name: data.my_info.name, mbti: data.my_info.mbti, gender: data.my_info.gender});
            setUserInfo('partner', {name: data.partner_info.name, mbti: data.partner_info.mbti, gender: data.partner_info.gender});

            //alert('분석 완료');
            await startAnalysis(data.id, data.uploaded_filename);
            goToStep('analysis');
        } catch (err) {
            console.error(err);
            alert(err);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#FFF7F5] font-sans"
            style={{ fontFamily: '"Noto Sans KR", sans-serif' }}
        >
            {selected ? (               
            
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
                <div className="flex items-center mb-6">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => goToStep('upload')}
                  className="mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                    <h2 className="text-xl font-bold">사용자 정보 입력</h2>
                </div>

                {/* 나의 정보 */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">나의 정보</h3>
                    <label className="block text-xs font-semibold mb-1">이름 (필수)</label>
                    <input
                        type="text"
                        placeholder="사용자 이름"
                        value={selected}
                        //onChange={(e) => setMyName(e.target.value)}
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                        readOnly
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select value={myMbti} onChange={(e) => setMyMbti(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>INTJ</option>
                                <option>INTP</option>
                                <option>ENTJ</option>
                                <option>ENTP</option>
                                <option>INFJ</option>
                                <option>INFP</option>
                                <option>ENFJ</option>
                                <option>ENFP</option>
                                <option>ISTJ</option>
                                <option>ISFJ</option>
                                <option>ESTJ</option>
                                <option>ESFJ</option>
                                <option>ISTP</option>
                                <option>ISFP</option>
                                <option>ESTP</option>
                                <option>ESFP</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select value={myGender} onChange={(e) => setMyGender(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 상대방 정보 */}
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-purple-700 mb-2">상대방 정보</h3>
                    <label className="block text-xs font-semibold mb-1">이름 (필수)</label>
                    <input
                        type="text"
                        placeholder="상대방 이름"
                        value={state.predictedSpeakers.find((name) => name !== selected)}
                        //onChange={(e) => setPartnerName(e.target.value)}
                        readOnly
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select value={partnerMbti} onChange={(e) => setPartnerMbti(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>INTJ</option>
                                <option>INTP</option>
                                <option>ENTJ</option>
                                <option>ENTP</option>
                                <option>INFJ</option>
                                <option>INFP</option>
                                <option>ENFJ</option>
                                <option>ENFP</option>
                                <option>ISTJ</option>
                                <option>ISFJ</option>
                                <option>ESTJ</option>
                                <option>ESFJ</option>
                                <option>ISTP</option>
                                <option>ISFP</option>
                                <option>ESTP</option>
                                <option>ESFP</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select value={partnerGender} onChange={(e) => setPartnerGender(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    className="w-full py-2 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-500 transition"
                >
                    {state.isAnalyzing ? '분석중...' : '분석하기'}
                </button>

                {/* Toast 메시지 */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-md px-4 py-2 text-sm text-gray-800 animate-fade-in">
                        <p className="font-semibold">파일 업로드 성공</p>
                        <p className="text-xs text-gray-500">파일이 성공적으로 업로드되었습니다.</p>
                    </div>
                )}
            </div>
            ) : (
            <div className="relative min-h-screen from-indigo-500 to-purple-600 flex flex-col">
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute w-20 h-20 bg-white/10 rounded-full top-1/5 left-1/10 animate-float1" />
                <div className="absolute w-28 h-28 bg-white/10 rounded-full bottom-1/3 left-1/4 animate-float2" />
                <div className="absolute w-16 h-16 bg-white/10 rounded-full top-3/4 right-1/6 animate-float3" />
            </div>

            {/* 본문 */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4">
                <div className="bg-white/90 backdrop-blur border border-white/30 shadow-xl rounded-3xl p-10 max-w-md w-full text-center animate-fadeIn">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-8">
                    당신의 이름을 선택해주세요!
                </h1>

                <div className="flex flex-wrap gap-4 justify-center">
                    {state.predictedSpeakers.map((name) => (
                    <button
                        key={name}
                        onClick={() => handleSelect(name)}
                        className={`relative px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 min-w-[140px] 
                        ${selected === name
                            ? 'bg-gradient-to-r from-green-400 to-green-600 text-white pointer-events-none'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105'}`}
                    >
                        {name}
                        {selected === name && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">✓</span>
                        )}
                    </button>
                    ))}
                </div>                
                </div>
            </main>
            <style>
                {`
                @keyframes float1 { 0%,100% {transform: translateY(0)} 50% {transform: translateY(-20px)} }
                @keyframes float2 { 0%,100% {transform: translateY(0)} 50% {transform: translateY(-30px)} }
                @keyframes float3 { 0%,100% {transform: translateY(0)} 50% {transform: translateY(-15px)} }

                .animate-float1 { animation: float1 6s ease-in-out infinite; }
                .animate-float2 { animation: float2 8s ease-in-out infinite; }
                .animate-float3 { animation: float3 7s ease-in-out infinite; }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
            </div>
        )
        }
        </div>
    );
};

export default UserInfoPage;
