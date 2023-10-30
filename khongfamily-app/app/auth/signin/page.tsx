"use client";

import React from "react";
import Image from "next/image";
import logo from "@/public/logo_black.png";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { SearchParams } from "@/types/common";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

export default function Page({ searchParams }: SearchParams) {
  const { status } = useSession();
  const router = useRouter();
  // console.log(session?.user);
  const { register, handleSubmit, watch, control } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: searchParams.callbackUrl as string | "/",
    });
  };

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <main>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div>
            <Image
              className="mx-auto h-10 w-auto"
              src={logo}
              alt="Khong Family Logo"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Email address"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Password"
                      {...field}
                    />
                  </div>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm leading-6">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="text-center text-sm leading-6 text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Click Here to Register
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
