let memoryAccessToken = null;

export const tokenService = {
  getAccessToken: () => {
    if (memoryAccessToken) return memoryAccessToken;
    return localStorage.getItem('ghardekho_access_token');
  },

  setAccessToken: (token) => {
    memoryAccessToken = token;
    if (token) {
      localStorage.setItem('ghardekho_access_token', token);
    } else {
      localStorage.removeItem('ghardekho_access_token');
    }
  },

  clearTokens: () => {
    memoryAccessToken = null;
    localStorage.removeItem('ghardekho_access_token');
    localStorage.removeItem('ghardekho_user');
  },

  getUser: () => {
    try {
      const data = localStorage.getItem('ghardekho_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('ghardekho_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ghardekho_user');
    }
  },
};
