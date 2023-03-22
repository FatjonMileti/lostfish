import axios from "../../utils";

const getAll = async () => {
  const response = await axios.get("/asset/get");
  return response.data;
};

export default { getAll };
