const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    const data = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    setAuthToken(data.token);
    return data;
  },

  signIn: async (email: string, password: string) => {
    const data = await fetchWithAuth('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  signOut: () => {
    setAuthToken(null);
  },

  getMe: async () => {
    return fetchWithAuth('/auth/me');
  },
};

export const expenses = {
  getAll: async () => {
    return fetchWithAuth('/expenses');
  },

  create: async (expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes: string | null;
  }) => {
    return fetchWithAuth('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  update: async (
    id: string,
    expense: {
      title: string;
      amount: number;
      category: string;
      date: string;
      notes: string | null;
    }
  ) => {
    return fetchWithAuth(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

export type Expense = {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string | null;
};
