import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import { saveFileMetadata } from "@/lib/prisma"; // Make sure this path is correct
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(
  req: NextRequest
): Promise<{
  fields: Record<string, string>;
  file: { filename: string; mimetype: string; buffer: Buffer };
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    let file: { filename: string; mimetype: string; buffer: Buffer } | null =
      null;

    // Convert Headers to IncomingHttpHeaders
    const headers: IncomingHttpHeaders = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const bb = busboy({ headers });

    bb.on("file", (name, stream, info) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        file = {
          filename: info.filename,
          mimetype: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    bb.on("field", (name, val) => {
      fields[name] = val;
    });

    bb.on("close", () => {
      if (!file) {
        reject(new Error("No file uploaded"));
      } else {
        resolve({ fields, file });
      }
    });

    bb.on("error", reject);

    req.body
      ?.pipeTo(
        new WritableStream({
          write(chunk) {
            bb.write(chunk);
          },
        })
      )
      .then(() => bb.end());
  });
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, file } = await parseForm(req);

    if (!file || !fields.docType) {
      return NextResponse.json(
        { error: "Missing file or document type" },
        { status: 400 }
      );
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `verification/${fields.docType}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        }
      ).end(file.buffer);
    });

    // Save file metadata to database
    await saveFileMetadata(
      fields.docType as string,
      result.public_id,
      result.secure_url,
      userId
    );

    return NextResponse.json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
