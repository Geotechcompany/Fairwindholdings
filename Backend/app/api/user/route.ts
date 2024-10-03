import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/authOptions';

export async function GET(req: Request) {
  try {
    console.log('GET /api/user called');
    const session = await getServerSession(authOptions);

    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session) {
      console.log('No session found');
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "You are not logged in" }),
        { status: 401 }
      );
    }

    console.log("User ID:", session.user?.id);

    if (!session.user?.id) {
      console.log('No user ID found in session');
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "User ID not found in session" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        country: true,
        currency: true,
        role: true,
      }
    });

    console.log("User from database:", JSON.stringify(user, null, 2));

    if (!user) {
      console.log('User not found in database');
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "User not found in database" }),
        { status: 404 }
      );
    }

    // Mock stats data (replace with actual data fetching logic)
    const stats = {
      pnl: 1000,
      profit: 1500,
      loss: 500,
      profitableOrders: "75%"
    };

    const responseData = {
      status: "success",
      data: { 
        userData: {
          ...user,
          balance: 10000, // Mock balance
          leverage: "1:100", // Mock leverage
          credit: 0, // Mock credit
          totalDeposits: 15000, // Mock total deposits
        },
        stats 
      }
    };

    console.log("Response data:", JSON.stringify(responseData, null, 2));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in /api/user route:', error);
    return new NextResponse(
      JSON.stringify({ status: "error", message: "Internal server error" }),
      { status: 500 }
    );
  }
}
