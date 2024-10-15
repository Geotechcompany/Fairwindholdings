"use client";

import React from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../Loader';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserManagement() {
  const { data, error } = useSWR<{ users: User[] }>('/api/admin/users', fetcher);

  if (error) {
    toast.error("Failed to load users");
    return <div>Failed to load users</div>;
  }

  if (!data) {
    return <Loader />;
  }

  const users = data.users;

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId: string) => {
    // Implement delete functionality
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="bg-[#1e2329] text-white p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-2 px-2">ID</th>
              <th className="pb-2 px-2">Name</th>
              <th className="pb-2 px-2">Email</th>
              <th className="pb-2 px-2">Phone</th>
              <th className="pb-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="py-4 px-2">{user.id.slice(0, 8)}...</td>
                <td className="py-4 px-2">
                  {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}`.trim() : '-'}
                </td>
                <td className="py-4 px-2">{user.email}</td>
                <td className="py-4 px-2">{user.phoneNumber || '-'}</td>
                <td className="py-4 px-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                    aria-label="Edit user"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white p-2 rounded"
                    aria-label="Delete user"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;