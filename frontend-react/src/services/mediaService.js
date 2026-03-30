import api from '../api/axios';

const mediaService = {
  getAllMedia: async () => {
    const response = await api.get('/media/me');
    return response.data;
  },

  getViolations: async () => {
    const response = await api.get('/media/violations/me');
    return response.data;
  },

  uploadMedia: async (formData) => {
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMedia: async (id) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  }
};

export default mediaService;
