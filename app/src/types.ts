// the following types match the format of the data stored in the Firebase RTDB
export type SessionData = {
  hostUserId: string;
  participants: Record<string, boolean>;
  queue: Record<string, any>;
  createdAt: number;
  deviceId?: string;
  deviceName?: string;
  currentTrack?: TrackData;
  isEnded?: boolean;
};

export type TrackData = {
  uri: string;
  name: string;
  artist: string;
  album: string;
  albumCoverUrl: string;
  isrc: string;
};

export type ArtistData = {
  uri: string;
  name: string;
  image: string;
  genres: string[];
  numFollowers: number;
};

export type QueueItemData = {
  addedAt: number;
  suggesterUsername: string;
  track: TrackData;
  voteCount: number;
  votes: Record<string, boolean>;
};

export type SongInfo = {
  title: string;
  artist: string;
  artistId: string;
  releaseDate: string;
  artistActiveArea?: string;
  artistBeginArea?: string;
  artistBeginYear?: string;
};

export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export type QuizData = Question[];

export type QuizSessionData = {
  hostUserId: string;
  participants: Record<string, boolean>;
  createdAt: number;
  started: boolean;
  isrcs?: Record<string, string[]>;
  questions?: Question[];
  isGeneratingQuestions?: boolean;
  currentQuestionIndex?: number;
  currentQuestionAnswers?: Record<string, string>;
  scores?: Record<string, number>;
  isQuizOver?: boolean;
};
