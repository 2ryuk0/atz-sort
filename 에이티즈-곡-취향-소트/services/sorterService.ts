import { useState, useCallback, useEffect } from 'react';
import { Song, HistoryItem } from '../types';

export const useMergeSort = (initialSongs: Song[]) => {
  // Main state
  const [queue, setQueue] = useState<Song[][]>([]);
  const [currentLeft, setCurrentLeft] = useState<Song[]>([]);
  const [currentRight, setCurrentRight] = useState<Song[]>([]);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [tempMerged, setTempMerged] = useState<Song[]>([]);
  const [sortedResult, setSortedResult] = useState<Song[] | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Progress estimation
  // We track "Merged Elements" instead of comparisons because automatic appends (when one side is empty) 
  // also count as progress in Merge Sort.
  const [totalMaxMergeSteps, setTotalMaxMergeSteps] = useState(1);
  const [mergedCount, setMergedCount] = useState(0);

  // Initialize sort
  const startSort = useCallback((songs: Song[]) => {
    // Shuffle initial list to avoid bias if already sorted
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    // Create initial queue of single-item arrays
    const initQueue = shuffled.map(s => [s]);
    
    setQueue(initQueue);
    setCurrentLeft([]);
    setCurrentRight([]);
    setTempMerged([]);
    setSortedResult(null);
    setHistory([]);
    setLeftIndex(0);
    setRightIndex(0);
    setMergedCount(0);
    
    // In Merge Sort, each element is merged approx ceil(log2(N)) times.
    // Total "element movements" = N * ceil(log2(N))
    const n = songs.length;
    const depth = Math.ceil(Math.log2(n));
    // Use Math.max(1, ...) to avoid division by zero
    setTotalMaxMergeSteps(Math.max(1, n * depth));
  }, []);

  // Reset sort state
  const reset = useCallback(() => {
    setQueue([]);
    setCurrentLeft([]);
    setCurrentRight([]);
    setLeftIndex(0);
    setRightIndex(0);
    setTempMerged([]);
    setSortedResult(null);
    setHistory([]);
    setMergedCount(0);
    setTotalMaxMergeSteps(1);
  }, []);

  // Check if we need to set up a new pair to compare
  const processQueue = useCallback(() => {
    if (sortedResult) return;

    // If we are actively comparing two arrays, do nothing
    if (currentLeft.length > 0 && currentRight.length > 0) {
      return;
    }

    // Setup next comparison from Queue
    if (queue.length >= 2) {
      const newQueue = [...queue];
      const left = newQueue.shift()!;
      const right = newQueue.shift()!;
      
      setQueue(newQueue);
      setCurrentLeft(left);
      setCurrentRight(right);
      setLeftIndex(0);
      setRightIndex(0);
      setTempMerged([]);
    } else if (queue.length === 1) {
      // Only one item left in queue -> Done
      setSortedResult(queue[0]);
    }
  }, [queue, currentLeft, currentRight, sortedResult]);


  // Trigger queue processing when state settles
  useEffect(() => {
    processQueue();
  }, [queue, currentLeft, currentRight, tempMerged.length, sortedResult, processQueue]);


  const saveHistory = () => {
    setHistory(prev => [
      ...prev,
      {
        queue: [...queue],
        currentLeft: [...currentLeft],
        currentRight: [...currentRight],
        leftIndex,
        rightIndex,
        tempMerged: [...tempMerged],
        mergedCount: mergedCount // Save current progress count
      }
    ]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    
    setQueue(lastState.queue);
    setCurrentLeft(lastState.currentLeft);
    setCurrentRight(lastState.currentRight);
    setLeftIndex(lastState.leftIndex);
    setRightIndex(lastState.rightIndex);
    setTempMerged(lastState.tempMerged);
    setMergedCount(lastState.mergedCount); // Restore progress
    
    setHistory(prev => prev.slice(0, -1));
  };

  const handleVote = (winner: 'left' | 'right' | 'tie') => {
    saveHistory();

    const leftSong = currentLeft[leftIndex];
    const rightSong = currentRight[rightIndex];

    if (winner === 'left') {
      setTempMerged(prev => [...prev, leftSong]);
      setLeftIndex(prev => prev + 1);
      setMergedCount(prev => prev + 1); // 1 item merged
    } else if (winner === 'right') {
      setTempMerged(prev => [...prev, rightSong]);
      setRightIndex(prev => prev + 1);
      setMergedCount(prev => prev + 1); // 1 item merged
    } else {
      // Tie - push both
      setTempMerged(prev => [...prev, leftSong, rightSong]);
      setLeftIndex(prev => prev + 1);
      setRightIndex(prev => prev + 1);
      setMergedCount(prev => prev + 2); // 2 items merged
    }
  };

  // Check bounds to trigger "Done with this pair" logic
  useEffect(() => {
    if (currentLeft.length === 0 && currentRight.length === 0) return;

    const leftDone = leftIndex >= currentLeft.length;
    const rightDone = rightIndex >= currentRight.length;

    if (leftDone || rightDone) {
        // Finish this pair immediately
        const remainingLeft = currentLeft.slice(leftIndex);
        const remainingRight = currentRight.slice(rightIndex);
        
        // Count automatic merges towards progress
        const autoMergedCount = remainingLeft.length + remainingRight.length;
        setMergedCount(prev => prev + autoMergedCount);

        const finalMerged = [...tempMerged, ...remainingLeft, ...remainingRight];
        
        // Update Queue
        setQueue(prev => [...prev, finalMerged]);
        
        // Reset pointers
        setCurrentLeft([]);
        setCurrentRight([]);
        setTempMerged([]);
        setLeftIndex(0);
        setRightIndex(0);
    }
  }, [leftIndex, rightIndex, currentLeft, currentRight, tempMerged]);

  const isLeftValid = leftIndex < currentLeft.length;
  const isRightValid = rightIndex < currentRight.length;

  const currentPair = (currentLeft.length > 0 && currentRight.length > 0 && isLeftValid && isRightValid) 
    ? { left: currentLeft[leftIndex], right: currentRight[rightIndex] }
    : null;

  // Force progress to 100% if sortedResult is present
  const progressValue = sortedResult 
    ? 100 
    : Math.min(100, Math.round((mergedCount / totalMaxMergeSteps) * 100));

  return {
    sortedResult,
    currentPair,
    progress: progressValue,
    startSort,
    handleVote,
    handleUndo,
    canUndo: history.length > 0,
    reset
  };
};