import { api } from '../api/axiosConfig';

export interface DiscussionGroup {
  id: string;
  title: string;
  topic: string;
  language: string;
  member_count: number;
  active_speakers: number;
  level: string;
  image_url: string;
}

export const groupService = {
  getGroups: async (): Promise<DiscussionGroup[]> => {
    try {
      const response = await api.get('/groups');
      return response.data?.data || [];
    } catch {
      return [];
    }
  },

  joinGroup: async (id: string) => {
    try {
      const response = await api.post(`/groups/${id}/join`);
      return response.data?.data;
    } catch {
      return null;
    }
  },
};
