import React, { useRef } from "react";
import { IconType } from "react-icons";
import {
  FaIdCard,
  FaHome,
  FaCreditCard,
  FaUser,
  FaUpload,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import useSWR from 'swr';

interface Document {
  id: string;
  type: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadAreaProps {
  icon: IconType;
  title: string;
  description: string;
  onUpload: (file: File) => void;
  isUploaded: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UploadArea: React.FC<UploadAreaProps> = ({
  icon: Icon,
  title,
  description,
  onUpload,
  isUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      onUpload(files[0]);
    }
  };

  const handleClick = () => {
    if (!isUploaded) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      className={`bg-[#1e2433] rounded-lg p-4 flex flex-col items-center justify-center h-40 ${
        isUploaded ? "cursor-default" : "cursor-pointer hover:bg-[#2a3142]"
      } transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Icon className="text-3xl text-gray-400 mb-2" />
      <h3 className="text-sm font-semibold mb-1 text-center">{title}</h3>
      <p className="text-xs text-gray-400 text-center">{description}</p>
      {isUploaded ? (
        <div className="text-green-500 mt-2">Uploaded</div>
      ) : (
        <FaUpload className="text-xl text-gray-400 mt-2" />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
      />
    </div>
  );
};

const Verification = () => {
  const { data: uploadedDocs, error, mutate } = useSWR<Document[]>('/api/upload/user-documents', fetcher);

  if (error) {
    toast.error("Failed to fetch uploaded documents");
  }

  const handleUpload = (docType: string) => async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.json(); // Consume the response body if needed
        toast.success(`${docType} uploaded successfully`);
        mutate(); // Trigger revalidation
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during upload");
    }
  };

  const uploadAreas = [
    {
      icon: FaIdCard,
      title: "UPLOAD PROOF OF ID",
      description: "drag and drop or click to upload",
      docType: "proofOfId",
    },
    {
      icon: FaHome,
      title: "UPLOAD PROOF OF RESIDENCE",
      description: "drag and drop or click to upload",
      docType: "proofOfResidence",
    },
    {
      icon: FaCreditCard,
      title: "UPLOAD CREDIT CARD FRONT",
      description: "drag and drop or click to upload",
      docType: "creditCardFront",
    },
    {
      icon: FaCreditCard,
      title: "UPLOAD CREDIT CARD BACK",
      description: "drag and drop or click to upload",
      docType: "creditCardBack",
    },
    {
      icon: FaIdCard,
      title: "UPLOAD PROOF OF ID BACK",
      description: "drag and drop or click to upload",
      docType: "proofOfIdBack",
    },
    {
      icon: FaUser,
      title: "UPLOAD SELFIE",
      description: "drag and drop or click to upload",
      docType: "selfie",
    },
  ];

  if (!uploadedDocs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        VERIFICATION
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {uploadAreas.map((area) => (
          <UploadArea
            key={area.docType}
            icon={area.icon}
            title={area.title}
            description={area.description}
            onUpload={handleUpload(area.docType)}
            isUploaded={uploadedDocs.some((doc) => doc.type === area.docType)}
          />
        ))}
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{
              width: `${(uploadedDocs.length / uploadAreas.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {uploadedDocs.length} of {uploadAreas.length} of your documents have
          been uploaded and confirmed
        </p>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        LIST OF UPLOADED DOCUMENTS
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2 px-2">DOCUMENT</th>
              <th className="pb-2 px-2">TIME UPLOADED</th>
              <th className="pb-2 px-2">TIME PROCESSED</th>
              <th className="pb-2 px-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {uploadedDocs.map((doc) => (
              <tr key={doc.id} className="border-t border-gray-700">
                <td className="py-2 px-2">{doc.type}</td>
                <td className="py-2 px-2">
                  {new Date(doc.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-2">
                  {doc.updatedAt
                    ? new Date(doc.updatedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="py-2 px-2">{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Verification;