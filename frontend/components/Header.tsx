"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../public/logo_vertical.png"
import Image from "next/image"
import { useSession } from "next-auth/react";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log(pathname)
    setIsMenuOpen(false);
  }, [pathname])

  return (
    <header className="flex items-center w-full p-5 bg-gray-300">
      <nav className="z-20 flex items-center justify-between w-full">

        {/* logo section */}
        {/* TODO: change logo */}
        <div className="relative h-[50px] w-[180px]">
          <Link href={"/"}>
            <Image src={logo} alt="khong family logo" fill />
          </Link>
        </div>

        {/* burger menu section */}
        <div className="self-end">
          <button
            className="relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div
              className={`relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-secondary ring-0 ring-gray-300 hover:ring-8 ring-opacity-30 duration-200 shadow-md ${isMenuOpen && "ring-4"
                }`}
            >
              <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                <div
                  className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left delay-100 ${isMenuOpen && "translate-y-6"
                    }`}
                ></div>
                <div
                  className={`bg-white h-[2px] w-7 rounded transform transition-all duration-300 delay-75 ${isMenuOpen && "translate-y-6"
                    }`}
                ></div>
                <div
                  className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${isMenuOpen && "translate-y-6"
                    }`}
                ></div>

                <div
                  className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 flex w-0 ${isMenuOpen && "w-12 translate-x-0 z-10"
                    }`}
                >
                  <div
                    className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 ${isMenuOpen && "rotate-45"
                      }`}
                  ></div>
                  <div
                    className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 ${isMenuOpen && "-rotate-45"
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          </button>
        </div>


        {/* menu section */}
        <ul
          className={`${!isMenuOpen ? "-top-full" : "-z-10 top-0"
            } text-xl absolute left-0 flex flex-col justify-center gap-5 items-center transition-all duration-500 ease-in-out bg-black/80 w-full text-center text-white h-full`}
        >
          <li className="mb-4">
            {status === "authenticated" ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1"><span>Welcome Home</span><h3 className="font-bold uppercase">{session?.user?.name}</h3></div>
                <Link href={"/auth/login"} className="px-4 py-2 rounded-md text-white bg-secondary font-medium">Sign out</Link>
              </div>
            ) : (
              <Link href={"/auth/login"} className="px-4 py-2 rounded-md text-white bg-secondary font-medium">Sign in</Link>
            )}
          </li>
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/finance"}>Album</Link>
          </li>
          <li>
            <Link href={"/finance"}>Finance</Link>
          </li>
          <li>
            <Link href={"/finance"}>Story</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
