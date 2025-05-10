import mongoose, { Schema } from "mongoose";


const searchResultSchema = new Schema(
    {
        searchRequestId: {
            type: Schema.Types.ObjectId,
            ref: "SearchRequest",
            required: true
        },
    }
)