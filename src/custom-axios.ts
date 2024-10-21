import axios from "axios";

const api = axios.create({
    baseURL: "https://9nsgvppxth.execute-api.us-east-1.amazonaws.com/dev",
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;