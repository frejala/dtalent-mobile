import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { UserProvider } from "@/context/useUser";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;