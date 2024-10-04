import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Accountpanel from './Accountpanel';
import { UserData } from '../types/user';

const ProtectedDashboard: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    } else if (isLoaded && isSignedIn && user) {
      fetchUserData(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [isLoaded, isSignedIn, user, router]);

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/user?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  function handleNavigate(route: string) {
    router.push(route);
  }

  if (!isLoaded || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar userData={userData} onNavigate={handleNavigate} />
      <div className="flex-grow">
        <Accountpanel userData={userData} />
        {/* Add other dashboard components here */}
      </div>
    </div>
  );
};

export default ProtectedDashboard;