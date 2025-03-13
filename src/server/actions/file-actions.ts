"use server";

import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { getErrorMessage } from "~/lib/utils/error-handling";
import { Mutations } from "~/server/db/queries";
import { PDFDocument } from "pdf-lib";

const utApi = new UTApi();

export async function deleteFileAction(fileId: bigint, fileKey: string) {
  try {
    const user = await auth();
    if (!user.userId) {
      throw new Error("Unauthorized");
    }

    await Mutations.deleteFile({
      file: { fileId, ownerId: user.userId },
    });

    if (fileKey !== "") {
      const res = await utApi.deleteFiles([fileKey]);
      console.log(res);
    } else {
      throw new Error("File key is empty");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function convertToPdfAction(fileUrl: string, fileType: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  if (fileType === "pdf") {
    return fileUrl;
  }

  // Fetch the file directly from the URL
  const response = await fetch(fileUrl);
  const data = await response.arrayBuffer();

  // Create a new PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  if (fileType === "image") {
    const image = await pdfDoc.embedJpg(data);
    const { width, height } = page.getSize();
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  } else if (fileType === "doc" || fileType === "text") {
    const text = new TextDecoder().decode(data);
    page.drawText(text, {
      x: 50,
      y: page.getHeight() - 50,
      size: 12,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}
