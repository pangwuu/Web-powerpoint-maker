import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SongSection {
  label: string;
  content: string;
}

export interface Song {
  id?: string;
  title: string;
  artist?: string;
  ccli_number?: string;
  sections: SongSection[];
}

export interface BibleReading {
  reference: string;
  version: string;
}

export interface AnnouncementItem {
  title: string;
  content?: string;
}

export interface OfferingInfo {
  account_name: string;
  account_number: string;
  bsb: string;
  reference: string;
  details: string;
}

export interface GenerateRequest {
  date: string;
  speaker: string;
  topic: string;
  church_name: string;
  service_name: string;
  bible_readings: BibleReading[];
  songs: Song[];
  response_songs: Song[];
  announcements: AnnouncementItem[];
  offering: OfferingInfo;
  prayer_points: string[];
  mingle_text: string;
  template_name: string;
  translate: boolean;
  language: string;
}

export const api = {
  getSongs: async () => {
    const response = await axios.get<Song[]>(`${API_BASE_URL}/songs`);
    return response.data;
  },
  
  createSong: async (song: Song) => {
    const response = await axios.post<Song>(`${API_BASE_URL}/songs`, song);
    return response.data;
  },

  updateSong: async (song: Song) => {
    const response = await axios.put<Song>(`${API_BASE_URL}/songs/${song.id}`, song);
    return response.data;
  },

  deleteSong: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/songs/${id}`);
  },
  
  getBiblePassage: async (ref: string, version: string) => {
    const response = await axios.get(`${API_BASE_URL}/bible`, {
      params: { ref, version }
    });
    return response.data;
  },
  
  generatePPT: async (data: GenerateRequest, signal?: AbortSignal) => {
    const response = await axios.post(`${API_BASE_URL}/generate`, data, {
      responseType: 'blob',
      signal,
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Service_${data.date}.pptx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
