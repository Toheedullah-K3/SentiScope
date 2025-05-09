import mongoose, {Schema} from "mongoose";

const searchRequestSchema = new Schema(
    {
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
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    } 
)

const SearchRequest = mongoose.model('SearchRequest', searchRequestSchema)
export default SearchRequest