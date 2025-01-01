import axios from "./axios";

async function getEmployees(params: Record<string, string>) {
  const response = await axios.get("/users/", { params });

  return response.data;
}

export default { getEmployees };
