import React, { useState, useEffect } from "react";
import { KYCRequest } from "@/types/kyc";

interface KYCRequest {
  id: string;
  userId: string;
  name: string;
  documentType: string;
  status: "Pending" | "Approved" | "Rejected";
  submissionDate: string;
  documentUrls: string[];
}

const KYCManagement: React.FC = () => {
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null
  );

  useEffect(() => {
    const fetchKYCRequests = async () => {
      const response = await fetch("/api/kyc");
      const data = await response.json();
      setKycRequests(data);
    };

    fetchKYCRequests();
  }, []);

  const handleReview = (request: KYCRequest) => {
    setSelectedRequest(request);
  };

  const handleApprove = async (id: string) => {
    // Implement approval logic
    // await fetch(`/api/kyc-requests/${id}/approve`, { method: 'POST' });
    // Refresh KYC requests after approval
  };

  const handleReject = async (id: string) => {
    // Implement rejection logic
    // await fetch(`/api/kyc-requests/${id}/reject`, { method: 'POST' });
    // Refresh KYC requests after rejection
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">KYC Management</h1>

      <div className="flex">
        <div className="w-2/3 pr-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">User ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Document Type</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Submission Date</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-700">
                  <td className="py-4">{request.userId}</td>
                  <td className="py-4">{request.name}</td>
                  <td className="py-4">{request.documentType}</td>
                  <td className="py-4">{request.status}</td>
                  <td className="py-4">{request.submissionDate}</td>
                  <td className="py-4">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleReview(request)}
                    >
                      Review
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-1/3 pl-4">
          {selectedRequest && (
            <div className="bg-[#2c3035] p-4 rounded">
              <h2 className="text-xl font-semibold mb-4">Document Review</h2>
              <p>
                <strong>User:</strong> {selectedRequest.name}
              </p>
              <p>
                <strong>Document Type:</strong> {selectedRequest.documentType}
              </p>
              <div className="mt-4">
                {selectedRequest.documentUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Document ${index + 1}`}
                    className="max-w-full mb-2 rounded"
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCManagement;
