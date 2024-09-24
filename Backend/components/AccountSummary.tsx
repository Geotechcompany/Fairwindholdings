import React from 'react';
import { Card, Grid } from '@mui/material';

type AccountSummaryProps = {
  userData: {
    balance: number;
    leverage: string;
    credit: number;
  };
};

const AccountSummary: React.FC<AccountSummaryProps> = ({ userData }) => {
  return (
    <Card className="p-6 bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <div className="text-center">
            <h4 className="text-md">Balance</h4>
            <p className="text-xl font-bold">${userData.balance.toFixed(2)}</p>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className="text-center">
            <h4 className="text-md">Leverage</h4>
            <p className="text-xl font-bold">{userData.leverage}</p>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className="text-center">
            <h4 className="text-md">Credit</h4>
            <p className="text-xl font-bold">${userData.credit.toFixed(2)}</p>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AccountSummary;
