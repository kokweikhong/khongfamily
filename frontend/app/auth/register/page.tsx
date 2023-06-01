"use client";

import { API_URL } from "@/types/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

interface IFormInputs {
  id: string,
  username: string,
  password: string,
  email: string,
}

// TODO: add redirect after successful registration
// TODO: add error message for existing user

export default function Page() {
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    console.log(data);
    data.id = "1";
    try {
      const res = await fetch(API_URL.users.registerUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res);
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  useEffect(() => {
    setErrorMessage(null);
  }, []);

  return (
    <main className="container mx-auto">
      <h1>Register User Page</h1>
      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 max-w-[600px] flex flex-col gap-10 items-center justify-center mx-auto">
        <div className="flex flex-col gap-1 w-full">
          <label className="uppercase font-semibold text-2xl text-primary">Username</label>
          <input {...register("username", { required: true })} className="focus:outline-0 p-1 border-b-[3px] border-b-primary" />
          {errors.username && "Username is required"}

        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="uppercase font-semibold text-2xl text-primary">Email</label>
          <input type="email" {...register("email", { required: true })} className="focus:outline-0 p-1 border-b-[3px] border-b-primary" />
          {errors.email && "Email is required"}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="uppercase font-semibold text-2xl text-primary">Password</label>
          <input type="password" {...register("password", { required: true })} className="focus:outline-0 p-1 border-b-[3px] border-b-primary" />
          {errors.password && "Password is required"}
        </div>

        <button type="submit"
          className="flex bg-primary px-4 py-2 font-medium text-white text-2xl rounded-md ml-auto">
          Register
        </button>
      </form>
    </main>
  );
}
