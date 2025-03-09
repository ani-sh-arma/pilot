import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Mutations, Queries } from "~/server/db/queries";
import { Cloud, Loader2 } from "lucide-react";

export default async function OnBoarding() {
  console.log(" On Onboarding screen ");

  const user = await auth();
  if (!user.userId) {
    console.log(" Signing in route caue user not found");

    return redirect("/signin");
  }

  console.log(" Onboarding 1234 ");
  const root = await Queries.getRootFolderForUser(user.userId);
  console.log(" Onboarding 4321");

  if (!root) {
    console.log(" Onboarding Not Route");
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-10 w-10 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
              Pilot
            </span>
          </div>
          <form
            action={async () => {
              "use server";

              console.log(" Onboarding");

              const user = await auth();
              if (!user.userId) {
                console.log(" Signing in route");
                return redirect("/signin");
              }

              console.log(`Before route`);
              const rootFolder = await Mutations.onBoardUser(user.userId);
              console.log(`Signing in route : ${rootFolder}`);

              return redirect(`/f/${rootFolder}`);
            }}
          >
            <button className="flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
              {"Create Home Vault"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // We'll still do the redirect, but we'll show a loading UI first
  // The browser will show this UI briefly before the redirect happens
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
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
