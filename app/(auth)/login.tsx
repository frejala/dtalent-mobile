import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "@/services/auth";
import { useUserContext } from "@/context/useUser";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useUserContext();

  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await authService.login({
        username: documentNumber,
        password,
      });

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);

      navigation.navigate("(tabs)" as never);
    } catch (error) {
      Alert.alert("Error al iniciar sesión", "Verifica tus credenciales");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/images/dTalentLogo.png")}
          style={styles.logo}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Número de documento"
            placeholderTextColor="#888"
            value={documentNumber}
            onChangeText={setDocumentNumber}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("Recuperar contraseña")}>
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#374151",
    padding: 24,
    borderRadius: 8,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  input: {
    height: 40,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotPasswordText: {
    marginTop: 16,
    color: "#60A5FA",
    textAlign: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
