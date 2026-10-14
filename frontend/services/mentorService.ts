import { api } from '../api/axiosConfig';

export interface Mentor {
  id: string;
  name: string;
  avatar_url: string;
  specialty: string;
  rating: number;
  review_count: number;
  status: 'online' | 'offline' | 'group' | 'ai';
  voice_id?: string;
  bio?: string;
  teaching_style?: string;
  is_ai?: boolean;
}

export const mentorService = {
  getMentors: async (status?: string): Promise<Mentor[]> => {
    try {
      const response = await api.get('/mentors', {
        params: status ? { status } : undefined,
      });
      return response.data?.data || [];
    } catch {
      return [];
    }
  },

  getMentorById: async (id: string): Promise<Mentor | null> => {
    try {
      const response = await api.get(`/mentors/${id}`);
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  bookSession: async (data: {
    mentorId: string;
    bookingType: 'chat' | 'call' | 'session' | 'request';
    scheduledAt?: string;
    notes?: string;
  }) => {
    try {
      const response = await api.post('/mentors/book', data);
      return response.data?.data;
    } catch {
      return null;
    }
  },
};
