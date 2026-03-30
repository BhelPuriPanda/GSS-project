import api from '../api/axios';

const aiService = {
  analyzeViolation: async (violationTitle, sourceUrl, matchedTitle) => {
    const response = await api.post('/ai/analyze', {
      violationTitle,
      sourceUrl,
      matchedTitle,
    });
    return response.data;
  },

  summarizeViolations: async (violations) => {
    const response = await api.post('/ai/summarize', { violations });
    return response.data;
  },

  draftTakedown: async (matchedTitle, sourceUrl, similarityScore, ownerName) => {
    const response = await api.post('/ai/draft-takedown', {
      matchedTitle,
      sourceUrl,
      similarityScore,
      ownerName,
    });
    return response.data;
  },
};

export default aiService;
