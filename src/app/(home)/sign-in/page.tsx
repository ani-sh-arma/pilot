import { Cloud } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function OnBoarding() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-20 w-20 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-5xl font-bold text-transparent">
            Pilot
          </span>
        </div>
        <h2 className="text-gray-500 text-sm">
          {"Store, share, and collaborate on files and folders."}
        </h2>
        <h2 className="text-gray-500 text-lg mb-8">{"Sign in to get started."}</h2>
        <button className="flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
          <SignInButton
            forceRedirectUrl={"/pilot"}
            signUpForceRedirectUrl={"/pilot"}
          />
        </button>
      </div>
    </div>
  );
}
