import { User } from "@/types";
import { useState, useEffect, useCallback } from "react";

const useStoredUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserStored, setIsUserStored] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsUserStored(true);
    } else {
      setUser(null);
      setIsUserStored(false);
    }
  }, []);

  const updateUser = useCallback((newUser: User | null) => {
    if (newUser) {
        const serializedValue = JSON.stringify(newUser);
      localStorage.setItem("user", serializedValue );
      setUser(newUser);
      setIsUserStored(true);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      setIsUserStored(false);
    }
  }, []);

  return { user, isUserStored, updateUser };
};

export default useStoredUser;
