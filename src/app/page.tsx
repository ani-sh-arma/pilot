import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function PilotHome() {
  return (
    <div className="justify-cente flex h-screen flex-col items-center gap-4 bg-gray-900">
      <center>
        <h2 className="color-white text-2xl font-bold text-cyan-50">
          Welcome to{" "}
        </h2>
        <h1 className="text-4xl font-bold text-cyan-50">Pilot Store</h1>
        <div className="flex flex-col items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </center>
    </div>
  );
}
