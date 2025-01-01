import React, { useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useUserContext } from "@/context/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [toggle, setToggle] = useState<boolean>(false);

  const { user } = useUserContext();

  const toggleLogout = () => {
    setToggle((prev) => !prev);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
      edges={["left", "right", "bottom"]}
    >
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.drawerContainer}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/dTalentLogo.png")}
            style={styles.logoImage}
          />
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        {user && (
          <View style={styles.userInfoRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName
                  ?.split(" ")
                  .map((name: string) => name[0])
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>

            <View style={styles.userNameContainer}>
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.userFullName}>{user.fullName}</Text>
            </View>

            <TouchableOpacity onPress={toggleLogout}>
              <MaterialIcons name="more-vert" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {toggle && (
          <DrawerItem
            label="Cerrar Sesión"
            onPress={signOut}
            labelStyle={styles.logoutLabel}
            style={styles.logoutButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    height: "100%",
  },
  drawerContainer: {
    backgroundColor: "#000000",
    height: "100%",
  },
  logoContainer: {
    padding: 20,
  },
  logoImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 732 / 180,
  },
  footerContainer: {
    backgroundColor: "#000000",
    display: "flex",
    flexDirection: "column",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  userInfoRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    display: "flex",
    backgroundColor: "#4285F4",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userNameContainer: {
    display: "flex",
    flex: 1,
  },
  welcomeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  userFullName: {
    color: "#ffffff",
    fontSize: 14,
  },
  logoutLabel: {
    color: "#ffffff",
  },
  logoutButton: {
    marginTop: 10,
  },
});
