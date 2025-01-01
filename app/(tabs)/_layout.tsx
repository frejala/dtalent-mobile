import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { useUserContext } from "@/context/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";

let rootLayoutMounted = false;

export default function TabLayout() {
  const router = useRouter();
  const { user } = useUserContext();
  const [readyToCheck, setReadyToCheck] = useState(false);

  useEffect(() => {
    if (!rootLayoutMounted) {
      rootLayoutMounted = true;
    }
    setReadyToCheck(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (readyToCheck && !user) {
        router.replace("/login");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [readyToCheck, user, router]);

  if (!readyToCheck) return null;

  return (
    <GestureHandlerRootView
      style={{
        display: "flex",
        flex: 1,
        height: "100%",
      }}
    >
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveBackgroundColor: "#0087D1",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#fff",
          drawerLabelStyle: { marginLeft: 10 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Empleados",
            headerTitle: "",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="people-sharp" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="receipts"
          options={{
            drawerLabel: "Recibos",
            headerTitle: "",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="receipt-sharp" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
