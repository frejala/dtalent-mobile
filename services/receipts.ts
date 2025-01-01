import axios from "./axios";

async function getReceipts(params: Record<string, string>) {
  const response = await axios.get("/receipts/", { params });

  return response.data;
}

async function getReceiptPDF(id: string) {
  const response = await axios.get(`/receipts/${id}/file`);

  return response.data;
}

export default { getReceipts, getReceiptPDF };
