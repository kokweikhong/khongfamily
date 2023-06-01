const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface IAPIMethods {
  get?: string
  create?: string
  update?: string
  delete?: string
}

export interface IAPIUrls {
  [key: string]: {
    [key: string]: IAPIMethods
  }
}


export const API_URL = {
  "finance": {
    "record": {
      "get": `${API_BASE_URL}/finance/record`,
      "create": `${API_BASE_URL}/finance/record/create/`,
      "update": `${API_BASE_URL}/finance/record/update`,
      "delete": `${API_BASE_URL}/finance/record/delete`,
    },
    "category": {
      "get": `${API_BASE_URL}/finance/category/`,
      "create": `${API_BASE_URL}/finance/category/create`,
      "update": `${API_BASE_URL}/finance/category/update`,
      "delete": `${API_BASE_URL}/finance/category/delete`,
    },
  },
  "users": {
    "getUsers": `${API_BASE_URL}/users`,
    "getByEmail": `${API_BASE_URL}/users/email/`,
    "registerUser": `${API_BASE_URL}/users/create`,
  },
}

