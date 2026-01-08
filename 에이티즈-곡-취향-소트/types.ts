export interface Song {
  id: number;
  title: string;
}

export type SortMode = 'ALL' | 'KOR_ONLY';

export interface SorterState {
  round: number;
  totalRoundsEstimate: number;
  progress: number;
}

export interface HistoryItem {
  queue: Song[][];
  currentLeft: Song[];
  currentRight: Song[];
  leftIndex: number;
  rightIndex: number;
  tempMerged: Song[];
  mergedCount: number;
}