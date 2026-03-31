import api from '../api/axios';

const aiService = {
  analyzeViolation: async (violationTitle, sourceUrl, matchedTitle) => {
    const response = await api.post('/ai/analyze', {
      violationTitle,
      sourceUrl,
      matchedTitle,
    });

    return {
      ...response.data,
      analysis: response.data?.data?.strategy || response.data?.strategy || '',
    };
  },

  summarizeViolations: async (violations) => {
    const response = await api.post('/ai/summarize', { violations });

    return {
      ...response.data,
      summary: response.data?.data?.summary || response.data?.summary || '',
    };
  },

  draftTakedown: async (matchedTitle, sourceUrl, similarityScore, ownerName) => {
    const response = await api.post('/ai/draft-takedown', {
      matchedTitle,
      sourceUrl,
      similarityScore,
      ownerName,
    });

    return {
      ...response.data,
      draft: response.data?.data?.email || response.data?.email || '',
    };
  },
};

export default aiService;
