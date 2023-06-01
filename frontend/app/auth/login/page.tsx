"use client";

import { getUserByEmail } from "@/utils/users";
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import { FormEvent, useState } from "react";
import bcrypt from 'bcryptjs'

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session, status } = useSession()
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputUser = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value
    }
    const user = await getUserByEmail({
      email: inputUser.email,
      password: inputUser.password
    });
    if (!user) {
      setErrorMessage("User not found");
      return;
    }
    const isPasswordValid = await bcrypt.compare(inputUser.password, user.password)
    if (!isPasswordValid) {
      setErrorMessage('Password is not valid')
      return;
    }
    setErrorMessage(null);
    await signIn("credentials", {
      redirect: true,
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      callbackUrl: "/finance",
    });
  }

  return (
    <div className="container mx-auto">

      {status === "unauthenticated" ? (
        <>
          <h1>Login Page</h1>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form onSubmit={onSubmit}
            className="flex flex-col gap-2 max-w-[500px] mx-auto bg-primary p-20 rounded-md mt-10"
          >
            <div className="py-4">
              <label htmlFor="email" className="font-semibold text-xl">Email</label>
              <input id="email" type="email" name="email" required className="p-1 rounded-md" />
            </div>
            <div className="py-4">
              <label htmlFor="password" className="font-semibold text-xl">Password</label>
              <input id="password" type="password" name="password" required className="p-1 rounded-md" />
            </div>
            <button type="submit" className="text-white font-semibold text-xl border border-white rounded-md py-2 px-4 mr-auto mt-4">Login</button>
          </form>
        </>
      ) : status === "authenticated" ? (
        <>
          <h1>Logout Page</h1>
          <div className="mt-[50px] flex flex-col gap-4 justify-center items-center mx-auto">
            <h2><span className="font-normal">Hi, </span><span className="uppercase">{session?.user?.name}</span></h2>
            <button onClick={() => signOut()} className="font-semibold bg-secondary text-white text-2xl rounded-md py-2 px-4">Logout</button>
          </div>
        </>
      ) : status === "loading" ? (
        <h1>Loading...</h1>
      ) : (
        <h1>Something went wrong...</h1>
      )
      }
    </div>

  );
}
