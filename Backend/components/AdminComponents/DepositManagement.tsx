import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import useSWR from 'swr';

interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  proofImageUrl: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const fallbackImageUrl = "/path/to/fallback-image.jpg";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

const DepositManagement: React.FC = () => {
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const { data: deposits, error, mutate } = useSWR<Deposit[]>('/api/admin/deposits', fetcher);

  if (error) {
    toast.error("Failed to load deposits");
    return <div>Failed to load deposits</div>;
  }

  if (!deposits) {
    return <div>Loading...</div>;
  }

  const handleStatusChange = async (depositId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/deposits/${depositId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Deposit ${newStatus.toLowerCase()}d successfully`);
        mutate();
      } else {
        toast.error(`Failed to ${newStatus.toLowerCase()} deposit`);
      }
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()}ing deposit:`, error);
      toast.error(`An error occurred while ${newStatus.toLowerCase()}ing the deposit`);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Download failed:', error);
        toast.error('Download failed');
      });
  };

  return (
    <div className="bg-[#1e2329] text-white p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Deposit Management</h1>
      {deposits.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-2 px-2">ID</th>
                <th className="pb-2 px-2">Proof</th>
                <th className="pb-2 px-2">Amount</th>
                <th className="pb-2 px-2">Currency</th>
                <th className="pb-2 px-2">Status</th>
                <th className="pb-2 px-2">Date</th>
                <th className="pb-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-gray-700">
                  <td className="py-4 px-2">{deposit.id.slice(0, 8)}...</td>
                  <td className="py-4 px-2">
                    <div className="relative w-16 h-16 cursor-pointer" onClick={() => setSelectedDeposit(deposit)}>
                      <Image
                        src={deposit.proofImageUrl || fallbackImageUrl}
                        alt="Deposit Proof"
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-2">{deposit.amount}</td>
                  <td className="py-4 px-2">{deposit.currency}</td>
                  <td className="py-4 px-2">{deposit.status}</td>
                  <td className="py-4 px-2">{new Date(deposit.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => setSelectedDeposit(deposit)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStatusChange(deposit.id, "APPROVED")}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(deposit.id, "REJECTED")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No deposits found.</p>
      )}

      <AnimatePresence>
        {selectedDeposit && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-black">
                Deposit Proof
              </h2>
              <div className="relative w-full h-[60vh] mb-4">
                <Image
                  src={selectedDeposit.proofImageUrl || fallbackImageUrl}
                  alt="Deposit Proof"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedDeposit(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedDeposit.proofImageUrl, `deposit_proof_${selectedDeposit.id}.jpg`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-600 flex items-center"
                >
                  <FaDownload className="mr-2" /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepositManagement;