import { createContext, ReactNode, useState } from "react";
export interface UserInfo {
  username: string | null;
  id?: string;
  _id?: string;
}

export const UserContext = createContext<{ userInfo: UserInfo | null; setUserInfo: (info: UserInfo | null) => void }>({
  userInfo: { username: null },
  setUserInfo: () => {},
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>({ username: null });
  return <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>;
}
