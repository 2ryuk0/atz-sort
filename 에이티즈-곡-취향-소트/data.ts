import { Song } from './types';

// Raw data provided by user
const RAW_DATA = `
해적왕
Treasure
Stay
My Way
HALA HALA (Hearts Awakened, Live Alive)
Say My Name
Desire
Light
Promise
From (2018)
Utopia
ILLUSION
WAVE
Aurora
Dancing Like Butterfly Wings
WONDERLAND
Win
If Without You
친구 (THANK U)
Mist
Sunrise
걸어가고 있어
Answer
지평선 (Horizon)
Star 1117
Precious
FEVER
THANXX
춤을 춰 (TO THE BEAT)
INCEPTION
One Day At A Time
불놀이야 (I'm The One)
선도부 (The Leaders)
Time Of Love
Take Me Home
Celebrate
Eternal Sunshine
Feeling Like I Do
Deja Vu
ROCKY
All About You
밤하늘 (Not Too Late)
야간비행 (Turbulence)
Be With You
The Letter
Still Here
Better
멋 (The Real) (흥 ver.)
WAVE (Overture)
WONDERLAND (킹덤 ver.)
Propaganda
Sector 1
Cyberpunk
Guerrilla
WDIG (Where Do I Go)
New World
HALAZIA
This World
Dune
BOUNCY (K-HOT CHILLI PEPPERS)
DJANGO
최면 (Wake Up)
Outlaw
WE KNOW
Emergency
미친 폼 (Crazy Form)
ARRIBA
Silver Light
꿈날 (Dreamy Day)
MATZ (홍중, 성화)
IT's You (여상, 산, 우영)
Youth (윤호, 민기)
Everything (종호)
Golden Hour
Blind
WORK
Empty Box
Shaboom
Siren
DEEP DIVE
Ice On My Teeth
Man on Fire
Selfish Waltz
Enough
Lemon Drop
Masterpiece
Now this house ain't a home
Castle
In Your Fantasy
NO1 (홍중)
Skin (성화)
Slide to me (윤호)
Legacy (여상)
Creep (산)
ROAR (민기)
Sagittarius (우영)
우리의 마음이 닿는 곳이라면 (To be your light) (종호)
Dreamers
Blue Summer
The King
Paradigm
Limitless
DIAMOND
NOT OKAY
Days
Birthday
Royal
Forevermore
Ash
12 Midnight
Tippy Toes
FACE
Crescendo
`;

// Helper to parse string to Song objects
const parseSongs = (text: string): Song[] => {
  return text
    .trim()
    .split('\n')
    .map((line, index) => ({ id: index, title: line.trim() }))
    .filter((s) => s.title.length > 0);
};

export const SONGS_ALL: Song[] = parseSongs(RAW_DATA);

// Identify Japanese releases to filter out for the "Korean Only" dataset.
// Based on ATEEZ discography logic.
const JAPANESE_TITLES = new Set([
  'Better',
  'Still Here',
  'Dreamers',
  'Blue Summer',
  'The King',
  'Paradigm',
  'Limitless',
  'DIAMOND',
  'NOT OKAY',
  'Days',
  'Birthday',
  'Royal',
  'Forevermore',
  'Ash',
  '12 Midnight',
  'Tippy Toes',
  'FACE',
  'Crescendo'
]);

export const SONGS_FILTERED: Song[] = SONGS_ALL.filter(
  (song) => !JAPANESE_TITLES.has(song.title)
);
