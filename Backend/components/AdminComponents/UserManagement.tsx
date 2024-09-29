import React, { useState, useEffect } from 'react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    // setUsers(fetchedUsers);
  }, []);

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">ID</th>
            <th className="pb-2">Username</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border-t border-gray-700">
              <td className="py-4">{user.id}</td>
              <td className="py-4">{user.username}</td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">{user.status}</td>
              <td className="py-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;