import React from "react";
import useSWR, { mutate } from "swr";
import { toast } from "react-hot-toast";
import { User } from "@/types/user";
import { FaEdit, FaTrash } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserManagement() {
  const { data, error } = useSWR<{ users: User[] }>("/api/admin/users", fetcher);

  if (error) {
    toast.error("Failed to load users");
    return <div>Failed to load users</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const users = data.users;

  if (!Array.isArray(users)) {
    console.error("Users data is not an array:", users);
    return <div>Error: Invalid user data</div>;
  }

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("User deleted successfully");
          mutate("/api/admin/users"); // Refetch the users data
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user");
      }
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">ID</th>
            <th className="pb-2">First Name</th>
            <th className="pb-2">Last Name</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Phone Number</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-700">
              <td className="py-4">{user.id}</td>
              <td className="py-4">{user.firstName}</td>
              <td className="py-4">{user.lastName}</td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">{user.phoneNumber}</td>
              <td className="py-4">{user.gender}</td>
              <td className="py-4">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
