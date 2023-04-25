"use client";

import { ICategory } from "@/types/finance/category";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import CategoryForm from "@/components/CategoryForm";
import svgEdit from "../../../public/icons/edit-square.svg";
import svgDelete from "../../../public/icons/trash.svg";


const Page: NextPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
  const [data, setData] = useState<ICategory>({
    id: 0,
    name: '',
    remarks: '',
    created_at: '',
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/category/`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);
  return (
    <div className="container mx-auto">
      <h2 className="m-4">Category Page</h2>
      <h3 className="mx-4">{`Total ${categories.length} items`}</h3>

      {/* button to create new category */}
      <div className="m-4">
        <button
          className="btn"
          onClick={() => {
            setData({
              id: 0,
              name: '',
              remarks: '',
              created_at: new Date().toISOString(),
            });
            setAction('create');
            setShowForm(true);
          }}
        >
          Create New Category
        </button>
      </div>

      {/* list of categories */}
      <div>
        <ul className="grid grid-cols-1 gap-1 max-w-[500px]">
          {categories.map((category) => (
            <li key={category.id} className="p-4 flex flex-col gap-1 border-b border-b-primary">
              <div><h3>{category.name}</h3></div>
              <div><p>{category.remarks}</p></div>
              <div className="flex gap-2">
                <button
                  className="btn"
                  onClick={() => {
                    setData(category);
                    setAction('update');
                    setShowForm(true);
                  }}
                >
                  <div className="w-[20px] h-[20px] relative">
                    <Image src={svgEdit} alt="edit" fill className="object-cover" />
                  </div>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setData(category);
                    setAction('delete');
                    setShowForm(true);
                  }}
                >
                  <div className="w-[20px] h-[20px] relative">
                    <Image src={svgDelete} alt="edit" fill className="object-cover" />
                  </div>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${showForm ? 'block' : 'hidden'} fixed top-0 w-full h-screen z-10 bg-white`}>
        <CategoryForm data={data} action={action} setShowForm={setShowForm} />
      </div>

    </div>
  );
};

export default Page;
