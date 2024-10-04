import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = req.headers.get("svix-signature");
  const payload = await req.json();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-signature": headerPayload as string,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }

  const { id, ...attributes } = evt.data;

  if (evt.type === "user.created") {
    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: attributes.email_addresses[0].email_address,
          firstName: attributes.first_name,
          lastName: attributes.last_name,
        },
      });

      console.log(`User created: ${user.id}`);
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Error creating user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
