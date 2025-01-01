import axios from "./axios";

async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await axios.post("/users/demo_login/", {
    username,
    password,
  });

  return response.data;
}

export default {
  login,
};
