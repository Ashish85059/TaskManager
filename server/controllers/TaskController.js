import TaskSchema from "../models/TaskSchema.js";

export const getAllTask = async (req, res) => {
    try {
        const Tasks = await TaskSchema.find({});
        return res.status(200).json({ Tasks });
    } catch (error) {
        res.status(401).json({"msg":"Error in fetching tasks"});
    }
};

export const createTask = async (req, res) => {
  try {
    const Task = await TaskSchema.create(req.body);
    res.status(200).json({ Task });
    
  } catch (error) {
    res.status(400).json({"error":error.message})
  }
};

export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskSchema.findById(id);
        
        if (!task) {
            return res.status(404).json({ msg: `No task with id ${id} ` });
        }
        res.status(200).json({task});
    } catch (error) {
        res.status(401).json({"msg":"Error in fetching tasks"});
    }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
  
    const updatedTask = await TaskSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  
    if (!updatedTask) {
      return res.status(404).json({ msg: `No task with id ${id} ` });
    }
  
    res.status(200).json({ msg: "Task modified", task: updatedTask });
  } catch (error) {
    res.status(500).json({"msg": error});
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
  
    const removedTask = await TaskSchema.findByIdAndDelete(id);
  
    if (!removedTask) {
      return res.status(404).json({ msg: `No task with id ${id} ` });
    }
  
    res.status(200).json({ msg: "Task deleted", task: removedTask });
    
  } catch (error) {
    res.status(500).json({"msg": "Error deleting task"});
  }
};
