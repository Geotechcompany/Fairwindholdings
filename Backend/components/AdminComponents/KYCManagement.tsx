"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { format, parseISO, isValid } from 'date-fns';
import useSWR from 'swr';
import Loader from '../Loader';

interface Document {
  id: string;
  type: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const fallbackImageUrl = "/path/to/fallback-image.jpg";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KYCManagement() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { data: documents, error, mutate } = useSWR<Document[]>('/api/kyc', fetcher);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (documents || error) {
      setIsLoading(false);
    }
  }, [documents, error]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    toast.error("Failed to load KYC documents");
    return <div>Failed to load KYC documents</div>;
  }

  if (!documents) {
    return <Loader />;
  }

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/kyc/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Document ${newStatus.toLowerCase()}d successfully`);
        mutate();
      } else {
        toast.error(`Failed to ${newStatus.toLowerCase()} document`);
      }
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()}ing document:`, error);
      toast.error(`An error occurred while ${newStatus.toLowerCase()}ing the document`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      let date = parseISO(dateString);
      if (!isValid(date)) {
        date = new Date(dateString);
      }
      if (!isValid(date)) {
        throw new Error('Invalid date');
      }
      return format(date, 'dd/MM/yyyy, HH:mm:ss');
    } catch (error) {
      console.error('Error parsing date:', error, 'Date string:', dateString);
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">KYC Management</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">
            <th className="pb-2">ID</th>
            <th className="pb-2">Document Preview</th>
            <th className="pb-2">Document Type</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-gray-700">
              <td className="py-4">{doc.id}</td>
              <td className="py-4">
                <div className="relative w-16 h-16 cursor-pointer" onClick={() => setSelectedDocument(doc)}>
                  <Image
                    src={doc.url || fallbackImageUrl}
                    alt={doc.type}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
              </td>
              <td className="py-4">{doc.type}</td>
              <td className="py-4">{doc.status}</td>
              <td className="py-4">{formatDate(doc.createdAt)}</td>
              <td className="py-4">
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleStatusChange(doc.id, "Approve")}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(doc.id, "Reject")}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {selectedDocument && (
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
                {selectedDocument.type}
              </h2>
              <div className="relative w-full h-[60vh] mb-4">
                <Image
                  src={selectedDocument.url || fallbackImageUrl}
                  alt={selectedDocument.type}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Implement download functionality here
                    toast.success("Download started");
                  }}
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
}

export default KYCManagement;
