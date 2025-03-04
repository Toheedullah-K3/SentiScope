import axios from "axios";

const getSearchRequest = async (req, res) => {
    const { search } = req.body;

    try {
        const response = await axios.post("http://127.0.0.1:5000", { search });
        res.json(response.data);
    } catch (error) {
        console.error("Error calling Python server:", error);
        res.status(500).json({ error: "Failed to connect to Python server" });
    }
};

export { getSearchRequest };
