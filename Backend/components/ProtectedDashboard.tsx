import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Accountpanel from './Accountpanel';
import { UserData } from '../types/user';

const ProtectedDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.email) {
      fetchUserData(session.user.email);
    }
  }, [status, session, router]);

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

  if (status === 'loading' || !userData) {
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