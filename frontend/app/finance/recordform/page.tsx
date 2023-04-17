"use client";

import React from 'react'

export interface IRecordFormProps {
  requestMethod: 'create' | 'update' | 'delete'
  data: any
}

const Page: React.FC<IRecordFormProps> = ({ requestMethod, data }) => {
  const [categories, setCategories] = React.useState<string[]>(['a', 'b', 'ac', 'bb', 'bd'])
  const [category, setCategory] = React.useState<string>('')
  return (
    <div>
      <h1>Page</h1>

      <div className='bg-red-300'>
        <label>TestingTags</label>
        <input type="text" className='bg-gray-300 peer' value={category} onChange={(e) => setCategory(e.target.value)} />
        <div className='peer-focus:visible invisible'>
          <ul>
            {categories.filter((c) => c.includes(category)).map((c) => (
              <li key={c} onClick={() => setCategory(c)}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


export default Page;
