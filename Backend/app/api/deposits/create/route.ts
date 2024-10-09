import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
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

function parseForm(req: NextRequest): Promise<{
  fields: Record<string, string>;
  file: { filename: string; mimetype: string; buffer: Buffer };
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    let file: { filename: string; mimetype: string; buffer: Buffer } | null =
      null;

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
    // First, try to find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user is not found by clerkId, try to find by email
    if (!user) {
      const clerkUser = await auth().getUser(userId);
      user = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0].emailAddress },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user && !user.clerkId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId },
      });
    }

    const { fields, file } = await parseForm(req);

    if (!file || !fields.amount || !fields.currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "deposits",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            }
          )
          .end(file.buffer);
      }
    );

    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: parseFloat(fields.amount),
        currency: fields.currency,
        status: "PENDING",
        proofImageUrl: result.secure_url,
      },
    });

    return NextResponse.json(deposit, { status: 201 });
  } catch (error) {
    console.error("Error creating deposit:", error);
    return NextResponse.json(
      { error: "Error creating deposit" },
      { status: 500 }
    );
  }
}
