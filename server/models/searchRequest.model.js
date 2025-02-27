import mongoose, {Schema} from "mongoose";

const searchRequestSchema = new Schema(
    {
        searchQuery: {
            type: String,
            lowercase: true,
            required: true,
            trim: true
        }
    }
)

const SearchRequest = mongoose.model('SearchRequest', searchRequestSchema)
export default SearchRequest