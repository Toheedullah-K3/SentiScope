import mongoose, {Schema} from "mongoose";

const searchRequestSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        searchQuery: {
            type: String,
            lowercase: true,
            required: true,
            trim: true
        }, 
        platform:{
            type: String,
        },
        model: {
            type: String,
        },
        totalPosts: {
            type: Number,
            default: 0
        },
        averageSentimentScore: {
            type: Number,
            default: 0
        }
        
    },
    {
        timestamps: true
    } 
)

const SearchRequest = mongoose.model('SearchRequest', searchRequestSchema)
export default SearchRequest