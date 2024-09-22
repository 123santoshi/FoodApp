import axios from 'axios';

export const getData = async () => {
  try {
    const response = await axios.get("http://localhost:4000/credentials");
    //.log("getemails==", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}


export const getAddress = async () => {
  try {
    const response = await axios.get("http://localhost:4000/credentials");
    console.log("get address=", response);
    const address= response.data.map((item)=> item.orders);
    return address;
  } catch (error) {
    console.error("Error while fetching the addresses :", error);
    throw error;
  }
}


