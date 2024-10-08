

  export interface Document {
    id: string;
    type: string;
    documentType: string;
    publicId: string;
    url: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
 export interface KYCRequest {
    id: string;
    userId: string;
    name: string;
    documentType: string;
    status: string;
    submissionDate: string;
    documents: Document[];
  }