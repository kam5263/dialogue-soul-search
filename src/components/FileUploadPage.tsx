
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useApp } from '@/contexts/AppContext';
// import { CloudUpload } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// const FileUploadPage: React.FC = () => {
//   const { state, setUploadedFile, goToStep } = useApp();
//   const [isDragging, setIsDragging] = useState(false);
//   const { toast } = useToast();

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       handleFile(files[0]);
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       handleFile(files[0]);
//     }
//   };

//   const handleFile = (file: File) => {
//     // Check if file is a text file
//     if (!file.name.endsWith('.txt')) {
//       toast({
//         title: "파일 형식 오류",
//         description: "카카오톡 대화 내보내기(.txt) 파일만 업로드 가능합니다.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setUploadedFile(file);
//     toast({
//       title: "파일 업로드 성공",
//       description: "파일이 성공적으로 업로드되었습니다.",
//     });
    
//     // Go to info page
//     goToStep('info');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
//       <Card className="w-full max-w-md p-6 shadow-card">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-2 text-primary">대화 분석기</h1>
//           <p className="text-gray-600">
//             카카오톡 대화 내용을 분석하여 상대방과의 관계와 대화 패턴을 알아보세요
//           </p>
//         </div>

//         <div
//           className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer mb-6 ${
//             isDragging 
//               ? 'border-primary bg-blue-50' 
//               : 'border-gray-300 hover:border-primary hover:bg-blue-50'
//           }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           onClick={() => document.getElementById('file-upload')?.click()}
//         >
//           <CloudUpload className="h-12 w-12 mx-auto mb-2 text-primary" />
//           <h3 className="text-lg font-medium mb-1">카카오톡 대화 파일 업로드</h3>
//           <p className="text-sm text-gray-500 mb-4">파일을 드래그하거나 클릭하여 업로드하세요</p>
//           <p className="text-xs text-gray-400">
//             카카오톡 &gt; 채팅방 &gt; 메뉴 &gt; 대화내용 &gt; 대화 내보내기(.txt)
//           </p>
          
//           <input
//             id="file-upload"
//             type="file"
//             accept=".txt"
//             className="hidden"
//             onChange={handleFileInput}
//           />
//         </div>
        
//         {state.uploadedFile && (
//           <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-center mb-6">
//             <div className="bg-green-100 p-2 rounded mr-3">
//               <CloudUpload className="h-5 w-5 text-green-600" />
//             </div>
//             <div className="flex-1 overflow-hidden">
//               <p className="font-medium text-sm text-green-800 truncate">{state.uploadedFile.name}</p>
//               <p className="text-xs text-green-600">{(state.uploadedFile.size / 1024).toFixed(2)} KB</p>
//             </div>
//           </div>
//         )}
        
//         <Button 
//           className="w-full"
//           disabled={!state.uploadedFile}
//           onClick={() => goToStep('info')}
//         >
//           다음 단계
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default FileUploadPage;

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Upload } from 'lucide-react';

const FileUploadPage: React.FC = () => {
    const { goToStepWithFile } = useApp();
    //const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleNext = () => {
        if (!file) {
            alert('파일을 업로드해주세요.');
            return;
        }
        //setStep(2); // 다음 페이지로 이동
        goToStepWithFile('info', file);
    };

    // STEP 2: 사용자 정보 입력 페이지
    //if (step === 2) {
        //return <UploadPage uploadedFile={file} />;
        //goToStep('info');
    //}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F5] font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center">
                <h1 className="text-pink-600 text-2xl font-bold mb-2">대화 분석기</h1>
                <p className="text-sm text-gray-600 mb-6">
                    카카오톡 대화 내용을 분석하여 상대방과의 관계와 대화 패턴을 알아보세요
                </p>

                <div className="border-2 border-dashed border-pink-300 rounded-xl p-6 mb-6">
                    <Upload size={32} className="mx-auto mb-2 text-pink-500" />
                    <label htmlFor="fileInput" className="cursor-pointer text-pink-600 font-semibold">
                        카카오톡 대화 파일 업로드
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        파일을 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        카카오톡 &gt; 채팅방 &gt; 메뉴 &gt; 대화 내보내기 &gt; 텍스트(.txt)
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    className="bg-pink-300 hover:bg-pink-400 text-white font-medium py-2 w-full rounded-full"
                >
                    다음 단계
                </button>
            </div>
        </div>
  );
};

export default FileUploadPage;
