import React, { useState, useEffect } from 'react';

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    // Fetch support tickets from API
    // setTickets(fetchedTickets);
  }, []);

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">ID</th>
            <th className="pb-2">User ID</th>
            <th className="pb-2">Subject</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Priority</th>
            <th className="pb-2">Created At</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-t border-gray-700">
              <td className="py-4">{ticket.id}</td>
              <td className="py-4">{ticket.userId}</td>
              <td className="py-4">{ticket.subject}</td>
              <td className="py-4">{ticket.status}</td>
              <td className="py-4">{ticket.priority}</td>
              <td className="py-4">{ticket.createdAt}</td>
              <td className="py-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                <button className="bg-green-500 text-white px-2 py-1 rounded">Respond</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Support;