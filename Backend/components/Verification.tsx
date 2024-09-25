import React from 'react';
import { FaIdCard, FaHome, FaCreditCard, FaUser } from 'react-icons/fa';

const UploadArea = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1e2433] rounded-lg p-4 flex flex-col items-center justify-center h-40">
    <Icon className="text-3xl text-gray-400 mb-2" />
    <h3 className="text-sm font-semibold mb-1">{title}</h3>
    <p className="text-xs text-gray-400 text-center">{description}</p>
  </div>
);

const Verification = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">VERIFICATION</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <UploadArea icon={FaIdCard} title="UPLOAD PROOF OF ID" description="drag and drop the document to this area" />
        <UploadArea icon={FaHome} title="UPLOAD PROOF OF RESIDENCE" description="drag and drop the document to this area" />
        <UploadArea icon={FaCreditCard} title="UPLOAD CREDIT CARD FRONT" description="drag and drop the document to this area" />
        <UploadArea icon={FaCreditCard} title="UPLOAD CREDIT CARD BACK" description="drag and drop the document to this area" />
        <UploadArea icon={FaIdCard} title="UPLOAD PROOF OF ID BACK" description="drag and drop the document to this area" />
        <UploadArea icon={FaUser} title="UPLOAD SELFIE" description="drag and drop the document to this area" />
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">0 of 6 of your documents have been uploaded and confirmed</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">LIST OF UPLOADED DOCUMENTS</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">DOCUMENT</th>
            <th className="pb-2">TIME UPLOADED</th>
            <th className="pb-2">TIME PROCESSED</th>
            <th className="pb-2">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {/* Add table rows here when documents are uploaded */}
        </tbody>
      </table>
    </div>
  );
};

export default Verification;