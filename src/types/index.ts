
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioUrl?: string;
  youtubeId?: string;
}

export interface Collection {
  id: string;
  name: string;
  songs: Song[];
}
