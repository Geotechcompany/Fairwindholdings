import axios from 'axios';

export const fetchDeposits = async () => {
  try {
    const response = await axios.get('/api/deposits');
    return response.data;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }
};