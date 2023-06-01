import { API_URL } from "@/types/api";
import { User } from "@/types/users";

// getUserByEmail to get user by email
export async function getUserByEmail(
  data: { email: string; password: string }
): Promise<User | null> {
  const res = await fetch(`${API_URL.users.getByEmail}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return null;
  }
  const user = await res.json();
  return user
}

