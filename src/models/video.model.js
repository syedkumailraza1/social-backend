import mongoose, {Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

videoSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true,
        },
        videoFile:{
            type: String,
            required: true,
        },
        thumbnail:{
            type: String,
            require:true
        },
        owner:{
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        duration:{
            type: Number,
            required: true
        },
        views: {
            type: Number,
            required: true,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        }

    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)