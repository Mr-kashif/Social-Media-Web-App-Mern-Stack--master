import mongoose from "mongoose";
const postSchema = mongoose.Schema(
    {
      userId: { type: String, required: true },
      desc: String,
      likes: [],
      image: String,
      comments: [
        {
          userId: { type: String, required: true },
          username: String,
          text: String,
          createdAt: { type: Date, default: Date.now }
        }
      ]
    },
    { timestamps: true }
  );
const postModel = mongoose.model("Posts", postSchema);
export   default postModel;