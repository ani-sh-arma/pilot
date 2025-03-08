import { Cloud} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default async function OnBoarding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-10 w-10 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
            Pilot
          </span>
        </div>
        <SignInButton forceRedirectUrl={"/pilot"} />
      </div>
    </div>
  );
}
