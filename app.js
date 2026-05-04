const STORAGE_KEY = "codex-todolist-items";

const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");
const progressText = document.querySelector("#progressText");
const clearCompletedButton = document.querySelector("#clearCompleted");
const filterButtons = document.querySelectorAll(".filter-button");
const template = document.querySelector("#todoItemTemplate");

let todos = loadTodos();
let currentFilter = "all";

render();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = todoInput.value.trim();

  if (!title) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: Date.now(),
  });

  todoInput.value = "";
  persistAndRender();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    render();
  });
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  persistAndRender();
});

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function persistAndRender() {
  saveTodos();
  render();
}

function render() {
  const visibleTodos = getVisibleTodos();
  todoList.replaceChildren(...visibleTodos.map(createTodoElement));

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  todoCount.textContent = `${active} 个进行中 / ${total} 个任务`;
  progressText.textContent = `${percent}%`;
  clearCompletedButton.disabled = completed === 0;
}

function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function createTodoElement(todo) {
  const item = template.content.firstElementChild.cloneNode(true);
  const checkbox = item.querySelector(".todo-check");
  const titleInput = item.querySelector(".todo-title");
  const deleteButton = item.querySelector(".delete-button");

  item.classList.toggle("is-completed", todo.completed);
  checkbox.checked = todo.completed;
  titleInput.value = todo.title;

  checkbox.addEventListener("change", () => {
    updateTodo(todo.id, { completed: checkbox.checked });
  });

  titleInput.addEventListener("change", () => {
    const title = titleInput.value.trim();

    if (!title) {
      removeTodo(todo.id);
      return;
    }

    updateTodo(todo.id, { title });
  });

  titleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      titleInput.blur();
    }
  });

  deleteButton.addEventListener("click", () => removeTodo(todo.id));

  return item;
}

function updateTodo(id, changes) {
  todos = todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo));
  persistAndRender();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  persistAndRender();
}
