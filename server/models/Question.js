import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    Question: { type: String, required: true },
    Chapter: String,
    Marks: Number,
    Type: String,
});

// 🔧 explicitly define collection name as "physics"
export default mongoose.model("Question", questionSchema, "physics");
