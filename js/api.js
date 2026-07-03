// ===== API.JS =====
// Centralized API communication utilities

const API_BASE_URL = 'http://localhost:5000';

// Token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Headers helper
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic fetch wrapper with error handling
const apiCall = async (endpoint, method = 'GET', body = null, includeAuth = true) => {
  try {
    const options = {
      method,
      headers: getHeaders(includeAuth)
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'API request failed',
      status: 'error'
    };
  }
};

// ===== AUTHENTICATION API CALLS =====

const authAPI = {
  // User Login
  login: async (email, password, selectedRole = 'attendee') => {
    return apiCall('/login', 'POST', { email, password, selectedRole }, false);
  },

  // User Registration/Signup
  register: async (firstName, lastName, email, password, role = 'attendee') => {
    return apiCall('/register', 'POST', { 
      name: `${firstName} ${lastName}`,
      email, 
      password, 
      role,
      isApproved: role === 'attendee' ? true : false
    }, false);
  },

  // Google Login (verify token on backend)
  loginWithGoogle: async (googleToken, email, firstName, lastName) => {
    return apiCall('/login/google', 'POST', { 
      googleToken, 
      email, 
      firstName, 
      lastName 
    }, false);
  }
};

// ===== EVENTS API CALLS =====

const eventsAPI = {
  // Get all events
  getAll: async () => {
    return apiCall('/api/events');
  },

  // Get single event by ID
  getById: async (eventId) => {
    return apiCall(`/api/events/${eventId}`);
  },

  // Create new event
  create: async (eventData) => {
    return apiCall('/api/events', 'POST', eventData);
  },

  // Update event
  update: async (eventId, eventData) => {
    return apiCall(`/api/events/${eventId}`, 'PUT', eventData);
  },

  // Delete event
  delete: async (eventId) => {
    return apiCall(`/api/events/${eventId}`, 'DELETE');
  }
};

// ===== BOOKINGS API CALLS =====

const bookingsAPI = {
  // Create booking
  book: async (userId, eventId) => {
    return apiCall('/api/bookings', 'POST', { userId, eventId });
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    return apiCall(`/api/bookings/${userId}`);
  }
};

// ===== DASHBOARD API CALLS =====

const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return apiCall('/api/dashboard');
  }
};

// ===== CONTACT FORM API CALLS =====

const contactAPI = {
  // Submit contact form
  submitForm: async (fullName, email, message) => {
    return apiCall('/api/contact', 'POST', { fullName, email, message }, false);
  }
};

// ===== UTILITY FUNCTIONS =====

// Check if user is logged in
const isLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Logout user
const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
};

// Handle API errors with user feedback
const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  const message = error || defaultMessage;
  showErrorMessage(message);
  return message;
};

// Export all APIs
const API = {
  auth: authAPI,
  events: eventsAPI,
  bookings: bookingsAPI,
  dashboard: dashboardAPI,
  contact: contactAPI,
  utils: {
    isLoggedIn,
    getCurrentUser,
    logout,
    getAuthToken,
    setAuthToken,
    clearAuthToken,
    handleApiError
  }
};
