<script setup>
import { computed, ref, watch } from "vue";

const STORAGE_KEY = "codex-vue-todolist-items";

const filters = [
  { value: "all", label: "全部" },
  { value: "active", label: "进行中" },
  { value: "completed", label: "已完成" },
];

const newTodo = ref("");
const currentFilter = ref("all");
const todos = ref(loadTodos());

const visibleTodos = computed(() => {
  if (currentFilter.value === "active") {
    return todos.value.filter((todo) => !todo.completed);
  }

  if (currentFilter.value === "completed") {
    return todos.value.filter((todo) => todo.completed);
  }

  return todos.value;
});

const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length);
const activeCount = computed(() => todos.value.length - completedCount.value);
const progress = computed(() => {
  if (todos.value.length === 0) {
    return 0;
  }

  return Math.round((completedCount.value / todos.value.length) * 100);
});

watch(
  todos,
  (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
  { deep: true },
);

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function addTodo() {
  const title = newTodo.value.trim();

  if (!title) {
    return;
  }

  todos.value.unshift({
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: Date.now(),
  });

  newTodo.value = "";
}

function updateTodoTitle(todo, value) {
  const title = value.trim();

  if (!title) {
    removeTodo(todo.id);
    return;
  }

  todo.title = title;
}

function removeTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id);
}

function clearCompleted() {
  todos.value = todos.value.filter((todo) => !todo.completed);
}
</script>

<template>
  <main class="app-shell">
    <section class="todo-app" aria-labelledby="app-title">
      <header class="app-header">
        <div>
          <p class="eyebrow">Today</p>
          <h1 id="app-title">Todolist</h1>
        </div>
        <div class="progress-ring" aria-label="任务完成进度">
          <span>{{ progress }}%</span>
        </div>
      </header>

      <form class="todo-form" @submit.prevent="addTodo">
        <label class="sr-only" for="todoInput">新增任务</label>
        <input
          id="todoInput"
          v-model="newTodo"
          type="text"
          maxlength="80"
          placeholder="添加一个待办事项..."
          autocomplete="off"
        >
        <button type="submit">添加</button>
      </form>

      <div class="toolbar" aria-label="任务筛选">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-button"
          :class="{ 'is-active': currentFilter === filter.value }"
          type="button"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <ul class="todo-list" :class="{ 'is-empty': visibleTodos.length === 0 }" aria-live="polite">
        <li
          v-for="todo in visibleTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ 'is-completed': todo.completed }"
        >
          <label class="check-wrap">
            <input v-model="todo.completed" class="todo-check" type="checkbox">
            <span class="custom-check" aria-hidden="true"></span>
          </label>

          <input
            class="todo-title"
            type="text"
            maxlength="80"
            :value="todo.title"
            @change="updateTodoTitle(todo, $event.target.value)"
            @keydown.enter="$event.target.blur()"
          >

          <button class="delete-button" type="button" aria-label="删除任务" @click="removeTodo(todo.id)">
            <span aria-hidden="true">×</span>
          </button>
        </li>
      </ul>

      <footer class="app-footer">
        <span>{{ activeCount }} 个进行中 / {{ todos.length }} 个任务</span>
        <button class="ghost-button" type="button" :disabled="completedCount === 0" @click="clearCompleted">
          清空已完成
        </button>
      </footer>
    </section>
  </main>
</template>
