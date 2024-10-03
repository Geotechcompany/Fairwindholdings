import axios from 'axios';

export const fetchUserData = async () => {
  try {
    console.log('Fetching user data...');
    const response = await axios.get('/api/user');
    console.log('User data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration');
    }
    throw new Error('An unexpected error occurred');
    throw new Error('An unexpected error occurred');
  }
};

// Add other auth-related functions here
