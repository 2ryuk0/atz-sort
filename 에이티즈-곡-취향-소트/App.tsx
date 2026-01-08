import React, { useState, useEffect, useRef } from 'react';
import { SONGS_ALL, SONGS_FILTERED } from './data';
import { useMergeSort } from './services/sorterService';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { Song, SortMode } from './types';

// Declare html2canvas on window
declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [mode, setMode] = useState<'setup' | 'battle' | 'result'>('setup');
  const [selectedDataset, setSelectedDataset] = useState<Song[]>([]);
  const { 
    startSort, 
    sortedResult, 
    currentPair, 
    handleVote, 
    handleUndo, 
    canUndo, 
    progress
  } = useMergeSort(selectedDataset);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sortedResult) {
      setMode('result');
    }
  }, [sortedResult]);

  const handleStart = (sortMode: SortMode) => {
    const data = sortMode === 'ALL' ? SONGS_ALL : SONGS_FILTERED;
    setSelectedDataset(data);
    startSort(data);
    setMode('battle');
  };

  const copyToClipboard = () => {
    if (!sortedResult) return;
    const text = sortedResult.map((s, i) => `${i + 1}. ${s.title}`).join('\n');
    navigator.clipboard.writeText(text).then(() => alert('클립보드에 복사되었습니다.'));
  };

  const saveImage = async () => {
    if (resultRef.current && window.html2canvas) {
      const canvas = await window.html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = 'ateez-ranking.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      alert('Image generation library not loaded yet.');
    }
  };

  // --- RENDER: SETUP ---
  if (mode === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
        <div className="max-w-md w-full text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter">
              에이티즈 곡 취향 소트
            </h1>
            <div className="w-12 h-1 bg-white mx-auto"></div>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => handleStart('ALL')}
              className="group cursor-pointer p-6 bg-transparent border border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-1">일본 곡 포함</h3>
              <span className="text-sm opacity-60 group-hover:opacity-100">
                {SONGS_ALL.length}곡
              </span>
            </button>

            <button 
              onClick={() => handleStart('KOR_ONLY')}
              className="group cursor-pointer p-6 bg-transparent border border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-1">한국 발매곡만</h3>
              <span className="text-sm opacity-60 group-hover:opacity-100">
                {SONGS_FILTERED.length}곡
              </span>
            </button>
          </div>
          
          <footer className="text-zinc-600 text-xs mt-12">
            @dearmars403
          </footer>
        </div>
      </div>
    );
  }

  // --- RENDER: RESULT ---
  if (mode === 'result' && sortedResult) {
    return (
      <div className="min-h-screen p-6 bg-black text-white flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex justify-end items-center mb-8 border-b border-zinc-800 pb-4">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="secondary" className="!py-2 !px-4 text-xs">
                텍스트 복사
              </Button>
              <Button onClick={saveImage} variant="accent" className="!py-2 !px-4 text-xs">
                이미지 저장
              </Button>
            </div>
          </div>

          <div ref={resultRef} className="bg-black p-8 border border-zinc-800">
            <div className="text-center mb-10">
               <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide">
                소트 결과
              </h1>
            </div>
            
            <div className="space-y-1">
              {sortedResult.map((song, idx) => (
                <div key={song.id} className="flex items-center p-3 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/30 transition-colors">
                  <span className={`
                    w-6 h-6 flex items-center justify-center font-bold text-sm mr-4
                    ${idx < 3 ? 'text-white' : 'text-zinc-600'}
                  `}>
                    {idx + 1}
                  </span>
                  <span className={`font-medium text-sm ${idx < 3 ? 'text-white' : 'text-zinc-300'}`}>
                    {song.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: BATTLE ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-xl flex flex-col h-full justify-center">
        <h2 className="text-center text-sm font-bold text-zinc-500 mb-10 tracking-normal uppercase">
          더 좋아하는 곡을 선택하세요!
        </h2>

        {currentPair ? (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {/* Left Choice */}
            <div 
              onClick={() => handleVote('left')}
              className="aspect-square flex items-center justify-center p-4 border border-zinc-800 hover:border-white hover:bg-white hover:text-black cursor-pointer transition-all duration-200 group"
            >
              <span className="text-lg md:text-xl font-bold text-center leading-tight break-keep">
                {currentPair.left.title}
              </span>
            </div>

            {/* Right Choice */}
            <div 
              onClick={() => handleVote('right')}
              className="aspect-square flex items-center justify-center p-4 border border-zinc-800 hover:border-white hover:bg-white hover:text-black cursor-pointer transition-all duration-200 group"
            >
              <span className="text-lg md:text-xl font-bold text-center leading-tight break-keep">
                {currentPair.right.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <span className="text-zinc-500 text-sm animate-pulse">다음 대결 준비 중...</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button onClick={() => handleVote('tie')} variant="secondary" className="text-xs">
            둘 다 좋아요
          </Button>
          <Button onClick={() => handleVote('tie')} variant="secondary" className="text-xs opacity-60 hover:opacity-100">
            모르겠어요
          </Button>
        </div>

        <ProgressBar progress={progress} />

        <div className="flex justify-center mt-6 h-10">
          {canUndo && (
            <button 
              onClick={handleUndo}
              className="flex items-center text-zinc-600 hover:text-white text-xs transition-colors px-4 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              이전 단계
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;