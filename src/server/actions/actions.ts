"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getStartedAction() {
  const user = await auth();

  if (!user.userId) {
    return redirect("/sign-in");
  }

  return redirect("/pilot");
}
