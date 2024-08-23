"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession, signIn, signOut } from "next-auth/react";

export default async function Component() {
  const { data: session } = useSession();
  await dbConnect();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 px-3 py-1 m-4" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
