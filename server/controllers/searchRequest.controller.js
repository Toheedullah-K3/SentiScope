import axios from "axios";
import SearchRequest from "../models/searchRequest.model.js";
import SearchResult from "../models/searchResult.model.js";

 

const getSearchRequest = async (req, res) => {
    // get the search request from the query
    // Validate the request body 
    // check if searchRequest is already in the database
    // if it is, return the response from the database
    // send the search request to the python server
    // and get the response
    // save the search request to the database
    // save the search result to the database
    // and send the response to the client


    const { search, model, platform } = req.query;

    if(!(search && model && platform)){
        return res.status(400).json({ error: "Missing query, model, or platform" });
    }

    const existingRequest = await SearchRequest.findOne({searchQuery: search });

    if(existingRequest){
        console.log("Existing Search Request:", existingRequest);
        return res.status(200).json({
            message: "Search request already exists",
            total_posts: existingRequest.total_posts,
            average_sentiment: existingRequest.average_sentiment,
            sentiment_details: existingRequest.sentiment_details,
            searchRequestId: existingRequest._id
        })
    }
    console.log("Search Request:", search, model, platform);
    
    try {
        const response = await axios.post("http://127.0.0.1:5000", { search, model, platform });
        const { total_posts, average_sentiment, sentiment_details } = response.data;

        console.log("Python Server Response:", response.data);
        
        if(!total_posts || sentiment_details.length === 0){
            return res.status(404).json({ error: "No results found" });
        }

        const searchRequest = await SearchRequest.create({
            searchQuery: search,
            platform: platform,
            model: model,
            userId: req.user?.id || null,
            totalPosts: total_posts,
            averageSentimentScore: average_sentiment
        })

        const searchResult = await SearchResult.insertMany(
            sentiment_details.map((result) => ({
                searchRequestId: searchRequest._id,
                postText: result.description || "",
                postCreatedAt: result.date || "",
                sentimentScore: result.sentiment_score
            }))
        )
        
        res.status(200).json(
            { total_posts, average_sentiment, sentiment_details, searchRequestId: searchRequest._id }
        );
        
    } catch (error) {
        console.error("Error calling Python server:", error);
        res.status(500).json({ error: "Failed to connect to Python server" });
    }
};
 
const getSearchRequestById = async (req, res) => {
    const {id} = req.query;

    try {
        const searchRequest = await SearchRequest.findById(id)

        return res.status(200).json({
            message: "SearchRequestById searched Successfully!",
            searchRequest
        })
    } catch (error) {
        console.error("Error", error)
    }

}
const getSentimentTrends = async (req, res) => {
    // get the
}
export { 
    getSearchRequest,
    getSearchRequestById
};
