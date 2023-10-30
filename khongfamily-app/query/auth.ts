import axios from "axios";

const authApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
});

export const validateJWT = async (accessToken: string) => {
  const res = await authApi.post("/validate", {
    accessToken,
  });
  return res.data;
};

export const signin = async (username: string, password: string) => {
  const res = await authApi.post("/signin", {
    username,
    password,
  });
  return res.data;
};
