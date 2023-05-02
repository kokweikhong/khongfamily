"use client";

import { ICategory } from "@/types/finance/category";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import svgEdit from "../../../public/icons/edit-square.svg";
import svgDelete from "../../../public/icons/trash.svg";
import { API_URL } from "@/types/api";
import Link from "next/link";

const Page: NextPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    handleGetCategories();
  }, []);

  async function handleGetCategories() {
    const res = await fetch(API_URL.finance.category.get ?? '');
    const data = await res.json();
    setCategories(data);
  }

  return (
    <div className="container mx-auto">
      <h2 className="m-4 capitalize">Finance Category Page</h2>
      <h3 className="mx-4">{`Total ${categories?.length ?? 0} items`}</h3>

      {/* button to create new category */}
      <div className="m-4">
        <Link
          className="btn capitalize"
          href={`/finance/category/create`}>
          Create New Category
        </Link>
      </div>

      {/* list of categories */}
      <div>
        <ul className="grid grid-cols-1 gap-1 max-w-[500px]">
          {categories?.map((data) => (
            <li key={data.id} className="p-4 flex flex-col gap-1 border-b border-b-primary">
              <div><h3>{data.name}</h3></div>
              <div><p>{data.remarks}</p></div>
              <div className="flex gap-2">
                <Link
                  className="btn"
                  href={`/finance/category/update/${data.id}`}
                >
                  <div className="w-[20px] h-[20px] relative">
                    <Image src={svgEdit} alt="edit" fill className="object-cover" />
                  </div>
                </Link>
                <Link
                  className="btn"
                  href={`/finance/category/delete/${data.id}`}
                >
                  <div className="w-[20px] h-[20px] relative">
                    <Image src={svgDelete} alt="edit" fill className="object-cover" />
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};

export default Page;
