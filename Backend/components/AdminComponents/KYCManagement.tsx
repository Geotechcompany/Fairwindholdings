import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaEye, FaFile, FaDownload } from "react-icons/fa";
import { format, parseISO, isValid } from 'date-fns';

interface Document {
  id: string;
  type: string;
  url: string; // Changed from documentUrl to url
  status: string;
  createdAt: string;
  updatedAt: string;
}

const fallbackImageUrl = "/path/to/fallback-image.jpg"; // Replace with an actual fallback image path

export function KYCManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch("/api/kyc");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load KYC documents");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const response = await fetch(
        `/api/kyc/${id}/${newStatus.toLowerCase()}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      const updatedDocument = await response.json();
      setDocuments((docs) =>
        docs.map((doc) => (doc.id === id ? updatedDocument : doc))
      );
      toast.success(`Document ${newStatus.toLowerCase()}d successfully`);
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update document status"
      );
    }
  }

  const getImageSrc = (doc: Document) => {
    if (doc.url && doc.url.startsWith("http")) {
      return doc.url;
    }
    return fallbackImageUrl;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      // First, try parsing as ISO
      let date = parseISO(dateString);
      
      // If not valid, try creating a new Date object
      if (!isValid(date)) {
        date = new Date(dateString);
      }
      
      // If still not valid, throw an error
      if (!isValid(date)) {
        throw new Error('Invalid date');
      }
      
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error parsing date:', error, 'Date string:', dateString);
      return 'Invalid Date';
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
        console.error('Error downloading file:', error);
        toast.error('Failed to download file');
      });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        KYC Management
      </h1>
      <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 divide-y divide-gray-200">
            {documents.map((doc) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-200 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-16 h-16">
                    {doc.url ? (
                      <Image
                        src={getImageSrc(doc)}
                        alt={doc.type}
                        width={64}
                        height={64}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-md">
                        <FaFile className="text-gray-500 text-2xl" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {doc.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {doc.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {formatDate(doc.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusChange(doc.id, "Approve")}
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-sm mr-2 transition-colors duration-300 hover:bg-green-600"
                  >
                    <FaCheck className="inline mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(doc.id, "Reject")}
                    className="bg-red-500 text-white px-2 py-1 rounded-full text-sm mr-2 transition-colors duration-300 hover:bg-red-600"
                  >
                    <FaTimes className="inline mr-1" /> Reject
                  </button>
                  <button
                    onClick={() => setSelectedDocument(doc)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm transition-colors duration-300 hover:bg-blue-600"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <h2 className="text-2xl font-bold mb-4">
                {selectedDocument.type}
              </h2>
              <div className="relative w-full h-[60vh] mb-4">
                <Image
                  src={getImageSrc(selectedDocument)}
                  alt={selectedDocument.type}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full transition-colors duration-300 hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedDocument.url, `${selectedDocument.type}.jpg`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center"
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
