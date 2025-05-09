import axios from "axios";
import SearchRequest from "../models/searchRequest.model.js";


 

const getSearchRequest = async (req, res) => {
    // get the search request from the body
    // Validate the request body 
    // check if searchRequest is already in the database
    // if it is, return the response from the database
    // send the search request to the python server
    // and get the response
    // save the search request to the database
    // and send the response to the client


    const { search, model, platform } = req.body;

    if(!(search && model && platform)){
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    const existingRequest = await SearchRequest.findOne({searchQuery: search });

    if(existingRequest){
        console.log("Existing Search Request:", existingRequest);
        return res.status(200).json({
            message: "Search request already exists",
            total_posts: existingRequest.total_posts,
            average_sentiment: existingRequest.average_sentiment,
            sentiment_details: existingRequest.sentiment_details
        })
    }
    console.log("Search Request:", search, model, platform);
    try {
        const response = await axios.post("http://127.0.0.1:5000", { search, model, platform });
        const { total_posts, average_sentiment, sentiment_details } = response.data;

        console.log("Python Server Response:", response.data);
        
        const searchRequest = await SearchRequest.create({
            searchQuery: search,
            platform: platform,
            model: model,
            userId: req.user?.id || null
        })
        
        res.status(200).json(
            { total_posts, average_sentiment, sentiment_details }
        );
        
    } catch (error) {
        console.error("Error calling Python server:", error);
        res.status(500).json({ error: "Failed to connect to Python server" });
    }
};
 
export { getSearchRequest };
