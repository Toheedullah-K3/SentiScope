import axios from "axios";

const getSearchRequest = async (req, res) => {
    const { search, model, platform } = req.body;
    console.log("Search Request:", search);
    console.log("Model:", model);
    console.log("Platform:", platform);
    try {
        const response = await axios.post("http://127.0.0.1:5000", { search, model, platform });
        console.log("Python Server Response:", response.data);
        const { total_posts, average_sentiment, sentiment_details } = response.data;
        res.status(200).json({ total_posts, average_sentiment, sentiment_details });
        
    } catch (error) {
        console.error("Error calling Python server:", error);
        res.status(500).json({ error: "Failed to connect to Python server" });
    }
};
 
export { getSearchRequest };
