import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: true
    },
     description: {
        type: String,
        required: true
     },
    date: {
        type: String,
        required: true,
        default: Date.now
     },
    priority: {
        type: String,
        required: true,
     },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
     },
    history: {
        type: Array,
        default: []
    }
  });

export default mongoose.model("Task", TaskSchema);
