import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Queries } from "~/server/db/queries";
import { Cloud } from "lucide-react";
import { LoadingUI } from "./loading-ui";
import { createHomeVault } from "~/server/actions/actions";

export default async function OnBoarding() {
  const user = await auth();
  if (!user.userId) {
    return redirect("/signin");
  }
  const root = await Queries.getRootFolderForUser(user.userId);

  if (!root) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-10 w-10 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
              Pilot
            </span>
          </div>
          <form action={createHomeVault}>
            <button className="flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
              Create Home Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <LoadingUI rootId={root.id.toString()} />;
}
