import mongoose, { Schema } from "mongoose";


const searchResultSchema = new Schema(
    {
        searchRequestId: {
            type: Schema.Types.ObjectId,
            ref: "SearchRequest",
            required: true
        },
        postText: {
            type: String,
            required: true
        },
        postCreatedAt: {
            type: String,
            required: true
        },
        sentiment: {
            type: String,
            required: true
        },
        sentimentScore: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const SearchResult = mongoose.model('SearchResult', searchResultSchema)
export default SearchResult;