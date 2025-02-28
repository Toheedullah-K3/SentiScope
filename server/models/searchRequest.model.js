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
            type: [String],
            enum: ["Reddit", "Twitter", "Facebook"],
            default: ["Twitter"]
        },
        model: {
            type: [String],
            enum: ["Textblob", "Vader", "GenAI"],
            default: ["Textblob"]
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