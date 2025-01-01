import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  initials: string;
  hasPendingReceipts: boolean;
  lastLogin: string;
  isSuperuser: boolean;
  username: string;
  firstName: string;
  lastName: string;
  nationality: string;
  email: string;
  fullName: string;
  role: string;
  dateJoined: string;
  createdAt: string;
  modifiedAt: string;
  address: string;
  phoneNumber: string;
  employeeNumber: number;
  requiredPasswordChange: boolean;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error saving user to AsyncStorage:", error);
      }
    })();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
