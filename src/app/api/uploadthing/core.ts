import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { Mutations, Queries } from "~/server/db/queries";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pilotUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "32MB",
      maxFileCount: 10,
    },
  })
    .input(z.object({ folderId: z.number() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      console.log("In the middleware");

      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      const folder = await Queries.getFolderById(BigInt(input.folderId));

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!folder) throw new UploadThingError("Invalid folder id");

      if (folder[0]?.ownerId !== user.userId)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file);

      let type = "file";
      let imageTypes = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
      let videoTypes = [
        "mp4",
        "mov",
        "avi",
        "mkv",
        "flv",
        "wmv",
        "m4v",
        "webm",
        "ogg",
        "ogv",
        "mpeg",
        "mpg",
        "mpeg4",
        "3gp",
        "3gpp",
        "3g2",
        "3gpp2",
        "m2ts",
        "ts",
        "mts",
        "webm",
        "vob",
        "m4p",
      ];
      let audioTypes = [
        "mp3",
        "wav",
        "ogg",
        "wma",
        "aac",
        "flac",
        "ape",
        "m4a",
        "m4b",
        "m4r",
        "m4a",
      ];
      let docTypes = [
        "txt",
        "doc",
        "docx",
        "pdf",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "csv",
        "rtf",
        "odt",
        "ods",
        "odp",
        "odg",
        "md",
        "html",
      ];

      imageTypes.forEach((imageType) => {
        if (file.type.split("/")[1] === imageType) {
          type = "image";
        }
      });

      videoTypes.forEach((videoType) => {
        if (file.type.split("/")[1] === videoType) {
          type = "video";
        }
      });

      audioTypes.forEach((audioType) => {
        if (file.type.split("/")[1] === audioType) {
          type = "audio";
        }
      });

      docTypes.forEach((docType) => {
        if (file.type.split("/")[1] === docType) {
          type = "doc";
        }
      });

      await Mutations.createFile({
        file: {
          name: file.name,
          type: type,
          ownerId: metadata.userId,
          parentId: BigInt(metadata.parentId),
          url: file.ufsUrl,
          size: file.size.toString(),
        },
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
