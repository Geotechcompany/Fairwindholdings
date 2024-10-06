import { toast } from 'react-hot-toast';
import { WithdrawalRequest } from '@/types/user';

export async function getWithdrawals() {
  try {
    const response = await fetch('/api/withdrawals');
    if (!response.ok) {
      throw new Error('Failed to fetch withdrawals');
    }
    return await response.json();
  } catch (error) {
    console.error('Withdrawal fetch error:', error);
    toast.error(`Failed to fetch withdrawals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}

export async function postWithdrawal(formData: WithdrawalRequest) {
  const response = await fetch('/api/withdrawals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit withdrawal request');
  }

  return response;
}
