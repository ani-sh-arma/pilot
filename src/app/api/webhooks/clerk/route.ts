import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "~/server/db";
import { file_table, folder_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { UTApi } from "uploadthing/server";

const utApi = new UTApi();

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = (await req.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variables
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the user.deleted event
  if (evt.type === "user.deleted") {
    const { id: userId } = evt.data;

    try {
      if (!userId) {
        throw new Error("User ID not available");
      }

      console.log(`User Data : ${userId}`);

      // Get files before deleting them
      const ownersFiles = await db
        .select()
        .from(file_table)
        .where(eq(file_table.ownerId, userId));

      // Extract file keys for uploadthing deletion
      const keys = ownersFiles
        .map((file) => file.fileKey)
        .filter((key): key is string => !!key);

      // Delete files from uploadthing if there are any keys
      if (keys.length > 0) {
        await utApi.deleteFiles(keys);
      }

      // Delete files from database
      await db.delete(file_table).where(eq(file_table.ownerId, userId));

      // Delete all folders owned by the user
      await db.delete(folder_table).where(eq(folder_table.ownerId, userId));

      console.log(`Successfully deleted data for user ${userId}`);
      console.log(`Deleted Files count: ${ownersFiles.length}`);
      console.log(`Deleted Folders operation completed`);

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Error deleting user data:", error);
      return new Response("Error deleting user data", { status: 500 });
    }
  }

  // Return a 200 response for other events
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
