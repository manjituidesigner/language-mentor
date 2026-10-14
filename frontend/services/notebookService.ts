import { api } from '../api/axiosConfig';

export interface NotebookItem {
  id: string;
  item_type: 'word' | 'grammar' | 'missed';
  title_or_word: string;
  phonetic?: string;
  part_of_speech?: string;
  translation: string;
  example_sentence?: string;
  example_translation?: string;
  rule_formula?: string;
  incorrect_example?: string;
  mentor_tip?: string;
  mastery_level?: 'Mastered' | 'Learning' | 'Review';
  is_bookmarked?: boolean;
}

export const notebookService = {
  getItems: async (type?: string, bookmarked?: boolean): Promise<NotebookItem[]> => {
    try {
      const response = await api.get('/notebook', {
        params: {
          ...(type && { type }),
          ...(bookmarked !== undefined && { bookmarked: String(bookmarked) }),
        },
      });
      return response.data?.data || [];
    } catch {
      return [];
    }
  },

  addItem: async (item: Partial<NotebookItem>) => {
    try {
      const response = await api.post('/notebook', item);
      return response.data?.data;
    } catch {
      return null;
    }
  },

  updateItem: async (id: string, updates: { isBookmarked?: boolean; masteryLevel?: string }) => {
    try {
      const response = await api.patch(`/notebook/${id}`, updates);
      return response.data?.data;
    } catch {
      return null;
    }
  },

  deleteItem: async (id: string) => {
    try {
      await api.delete(`/notebook/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
