require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema and Model
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  category: String,
  done: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const { title, description, priority, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and Description are required." });
  }

  const newTodo = new Todo({
    title,
    description,
    priority,
    category,
    done: false,
  });

  await newTodo.save();
  res.json(newTodo);
});

// Mark as done
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { done: true },
    { new: true }
  );
  res.json(updatedTodo);
});

// Remove a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted successfully" });
});

// Start Server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
