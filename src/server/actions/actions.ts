"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Mutations } from "../db/queries";

export async function getStartedAction() {
  const user = await auth();

  if (!user.userId) {
    return redirect("/sign-in");
  }

  return redirect("/pilot");
}

export async function createHomeVault() {
  const user = await auth();
  if (!user.userId) {
    return redirect("/signin");
  }

  const rootFolder = await Mutations.onBoardUser(user.userId);
  return redirect(`/f/${rootFolder}`);
}
