import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Queries } from "~/server/db/queries";
import { Cloud, Loader2 } from "lucide-react";

export default async function OnBoarding() {
  const user = await auth();
  if (!user.userId) {
    return redirect("/signin");
  }

  const root = await Queries.getRootFolderForUser(user.userId);

  if (!root) {
    console.log("Creating root folder");
  }

  // We'll still do the redirect, but we'll show a loading UI first
  // The browser will show this UI briefly before the redirect happens
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-10 w-10 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
            Pilot
          </span>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-lg text-gray-300">Preparing your workspace...</p>
        </div>
      </div>

      <div className="mt-12">
        {/* This will trigger the redirect */}
        <meta httpEquiv="refresh" content={`0;url=/f/${root?.id}`} />
      </div>
    </div>
  );
}
