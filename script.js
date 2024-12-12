// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const searchInput = document.getElementById("searchInput");
const prioritySelect = document.getElementById("priority");
const filterButtons = document.querySelectorAll(".filter-btn");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    searchInput.addEventListener("input", filterTasks);
    filterButtons.forEach(button =>
        button.addEventListener("click", filterByPriority)
    );
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    const priority = prioritySelect.value;
    if (newTask !== "") {
        todo.push({
            text: newTask,
            priority: priority || "low",
            disabled: false,
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

function displayTasks(filteredTodo = todo) {
    todoList.innerHTML = "";
    filteredTodo.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = `priority-${item.priority}`;
        li.innerHTML = `
        <div class="todo-container">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
            <span id="todo-${index}" class="${item.disabled ? "disabled" : ""}">${item.text}</span>
        </div>
        `;
        const checkbox = li.querySelector(".todo-checkbox");
        checkbox.addEventListener("change", () => toggleTask(index));
        li.querySelector("span").addEventListener("click", () => editTask(index));
        todoList.appendChild(li);
    });
    todoCount.textContent = `${filteredTodo.length} items total`;
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function editTask(index) {
    const taskElement = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = existingText;
    inputElement.className = "edit-input";
    taskElement.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        saveEditedTask(index, inputElement);
    });

    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveEditedTask(index, inputElement);
        }
    });
}

function saveEditedTask(index, inputElement) {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
        todo[index].text = updatedText;
    }
    saveToLocalStorage();
    displayTasks();
}

function deleteAllTasks() {
    todo = [];
    saveToLocalStorage();
    displayTasks();
}

function filterTasks() {
    const query = searchInput.value.toLowerCase();
    const filteredTasks = todo.filter(item => item.text.toLowerCase().includes(query));
    displayTasks(filteredTasks);
}

function filterByPriority(event) {
    const priority = event.target.dataset.priority;

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.remove("active");
    });
    event.target.classList.add("active");

    const filteredTasks = priority === "all" ? todo : todo.filter(item => item.priority === priority);
    displayTasks(filteredTasks);
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}
