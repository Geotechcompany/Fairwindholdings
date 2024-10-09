import React, { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaCloudUploadAlt,
  FaPause,
  FaTimes,
  FaCopy,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

const depositSchema = z.object({
  depositAddress: z.string().min(1, "Deposit address is required"),
  amount: z.number().positive("Amount must be positive"),
});

type DepositFormData = z.infer<typeof depositSchema>;

interface DepositRequest {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prevProgress) => {
            if (prevProgress === null || prevProgress >= 100) {
              clearInterval(interval);
              onFileUpload(file);
              return 100;
            }
            return prevProgress + 10;
          });
        }, 500);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="bg-[#2c3035] p-6 rounded-lg shadow-lg">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed ${
          isDragActive ? "border-blue-500" : "border-gray-600"
        } rounded-lg p-8 text-center cursor-pointer transition-colors duration-300`}
      >
        <input {...getInputProps()} />
        <p className="text-white mb-4">Drag and drop to upload your files</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300">
          <FaCloudUploadAlt className="mr-2" />
          Browse Files
        </button>
      </div>

      {uploadProgress !== null && (
        <div className="mt-4 bg-[#1e2329] rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white">{fileName}</span>
            <span className="text-white">{uploadProgress}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2c3035]">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              ></div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaPause />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors duration-300"
              onClick={() => {
                setUploadProgress(null);
                setFileName(null);
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface DepositData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  proofImageUrl: string;
}

const Deposit: React.FC = () => {
  const { user } = useUser();
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [depositAddress, setDepositAddress] = useState("");
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deposits, setDeposits] = useState<DepositData[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  useEffect(() => {
    if (showProofUpload && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowProofUpload(false);
      toast.error("Payment proof upload time expired");
    }
  }, [showProofUpload, countdown]);

  useEffect(() => {
    // Fetch deposit address from API
    setDepositAddress("TXD8NY5qeHA3FTa4mUZ7LaGhHh6pDUTtWU");

    // Fetch deposit requests from API
    setDepositRequests([
      {
        id: "1",
        amount: 100,
        currency: "USDT",
        status: "Pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        amount: 200,
        currency: "USDT",
        status: "Approved",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (user) {
      fetchDeposits();
    }
  }, [user]);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/deposits");
      if (!response.ok) {
        throw new Error("Failed to fetch deposits");
      }
      const data = await response.json();
      setDeposits(data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to fetch deposits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositClick = () => {
    setShowProofUpload(true);
    setCountdown(3600);
    setValue("depositAddress", depositAddress);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    toast.success("Address copied to clipboard");
  };

  const onSubmit = async (data: DepositFormData) => {
    try {
      if (!uploadedFile) {
        toast.error("Please upload payment proof");
        return;
      }

      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("amount", data.amount.toString());
      formData.append("currency", "USDT");

      const response = await fetch("/api/deposits/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit deposit request: ${errorText}`);
      }

      toast.success("Deposit request submitted successfully");
      reset();
      setShowProofUpload(false);
      setUploadedFile(null);
      fetchDeposits();
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to submit deposit request: ${errorMessage}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">DEPOSIT</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">USDT (TRC20) Deposit</h2>
        <div className="bg-[#2c3035] rounded-lg p-4">
          <button
            onClick={handleDepositClick}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Deposit USDT (TRC20)
          </button>
        </div>
      </div>

      {showProofUpload && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
          <div className="bg-[#2c3035] rounded-lg p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="depositAddress" className="block mb-1">
                  Deposit Address
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="depositAddress"
                    {...register("depositAddress")}
                    className="w-full p-2 bg-[#1e2329] rounded-l"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
                {errors.depositAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.depositAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="amount" className="block mb-1">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  id="amount"
                  {...register("amount", { valueAsNumber: true })}
                  className="w-full p-2 bg-[#1e2329] rounded"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Submit Proof
                </button>
                <div className="flex items-center text-yellow-500">
                  <FaClock className="mr-2" />
                  <span>
                    {Math.floor(countdown / 60)}:
                    {(countdown % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Deposit Requests</h2>
        {isLoading ? (
          <p>Loading deposits...</p>
        ) : deposits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Currency</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{deposit.id.slice(0, 8)}...</td>
                    <td className="px-4 py-2">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{deposit.amount}</td>
                    <td className="px-4 py-2">{deposit.currency}</td>
                    <td className="px-4 py-2">
                      <Badge
                        className={`${getStatusColor(
                          deposit.status
                        )} text-white`}
                      >
                        {deposit.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No deposits found.</p>
        )}
      </div>
    </div>
  );
};

export default Deposit;
