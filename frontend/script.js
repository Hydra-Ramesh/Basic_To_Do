// const config = require('./config.js');
import { backendUrl } from "./config.js";
// const backendUrl = 'http://localhost:3000'
const todoApp = (() => {
    const container = document.getElementById("container");
    let todos = [];

    const fetchTodos = async () => {
        const response = await fetch(`${backendUrl}/todos`); // updated URL
        todos = await response.json();
        renderTodos();
    };

    const createChild = (todo) => {
        const { _id, title, description, priority, category, done } = todo; // updated field (_id)
        const child = document.createElement("div");
        child.classList.add("todo-item");
        if (done) child.classList.add("done");
        child.setAttribute("id", _id); // updated field (_id)

        const details = document.createElement("div");
        details.classList.add("details");
        details.innerHTML = `
            <strong>${title}</strong> <br>
            ${description} <br>
            <em>Priority: ${priority}, Category: ${category}</em>
        `;

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const doneButton = document.createElement("button");
        doneButton.innerHTML = done ? "Done!" : "Mark as Done";
        doneButton.disabled = done;
        doneButton.onclick = () => markAsDone(_id); // updated field (_id)

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.onclick = () => removeTask(_id); // updated field (_id)

        actions.appendChild(doneButton);
        actions.appendChild(removeButton);
        child.appendChild(details);
        child.appendChild(actions);

        return child;
    };

    const renderTodos = () => {
        container.innerHTML = "";
        todos.forEach(todo => {
            const child = createChild(todo);
            container.appendChild(child);
        });
    };

    const addTodo = async () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const priority = document.getElementById("priority").value;
        const category = document.getElementById("category").value;

        if (!title || !description) {
            alert("Please fill out both title and description.");
            return;
        }

        const newTodo = {
            title,
            description,
            priority,
            category,
        };

        const response = await fetch(`${backendUrl}/todos`, { // updated URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        });

        const savedTodo = await response.json();
        todos.push(savedTodo);
        renderTodos();

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("priority").value = "Low";
        document.getElementById("category").value = "Personal";
    };

    const markAsDone = async (_id) => { // updated parameter (_id)
        const response = await fetch(`${backendUrl}/todos/${_id}`, { // updated URL
            method: "PUT",
        });

        const updatedTodo = await response.json();
        todos = todos.map(todo => (todo._id === _id ? updatedTodo : todo)); // updated field (_id)
        renderTodos();
    };

    const removeTask = async (_id) => { // updated parameter (_id)
        await fetch(`${backendUrl}/todos/${_id}`, { // updated URL
            method: "DELETE",
        });

        todos = todos.filter(todo => todo._id !== _id); // updated field (_id)
        renderTodos();
    };

    const filterTodos = () => {
        const search = document.getElementById("search").value.toLowerCase();
        const filtered = todos.filter(todo =>
            todo.title.toLowerCase().includes(search)
        );
        container.innerHTML = "";
        filtered.forEach(todo => {
            const child = createChild(todo);
            container.appendChild(child);
        });
    };

    fetchTodos();

    return {
        addTodo,
        filterTodos,
    };
})();

window.todoApp = todoApp;