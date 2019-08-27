<template>
  <section class="todo-App">
    <header class="todo-Header">
      <h1>{{title}}</h1>
      <input
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="todo-Body" v-show="todos.length" v-cloak>
      <div class="todo-Item-content">
        <label for="toggle-all">
          <input id="toggle-all" type="checkbox" v-model="allDone" />
          Toggle All
        </label>
      </div>
      <ul class="todo-Items">
        <li
          v-for="todo in filteredTodos"
          class="todo-Item"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="todo-Item-view">
            <div class="todo-Item-content">
              <label>
                <input class="toggle" type="checkbox" v-model="todo.completed" />
                {{ todo.title }}
              </label>
            </div>
            <div class="todo-Item-buttons">
              <a href="#" @click="editTodo(todo)">Edit</a>
              <a href="#" @click="removeTodo(todo)">Remove</a>
            </div>
          </div>
          <div class="todo-Item-edit">
            <input
              type="text"
              v-model="todo.title"
              v-todo-focus="todo == editedTodo"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            />
          </div>
        </li>
      </ul>
    </section>
    <footer class="todo-Footer" v-show="todos.length" v-cloak>
      <p class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize }} left
      </p>
      <input type="radio" name="filter" id="filter-all" value="all" @click="setHash('all')" />
      <label for="filter-all">All</label>
      <input
        type="radio"
        name="filter"
        id="filter-active"
        value="active"
        @click="setHash('active')"
      />
      <label for="filter-active">Active</label>
      <input
        type="radio"
        name="filter"
        id="filter-completed"
        value="completed"
        @click="setHash('completed')"
      />
      <label for="filter-completed">Completed</label>
      <a
        href="#"
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >Clear completed</a>
    </footer>
  </section>
</template>

<script>
import todoStorage from "../utils/storage";
import filters from "../utils/filters";

export default {
  name: "TodoList",
  props: {
    title: String,
    visibility: String
  },

  data: () => ({
    todos: todoStorage.fetch(),
    newTodo: "",
    editedTodo: null
  }),

  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos);
      },
      deep: true
    }
  },

  computed: {
    filteredTodos: function() {
      return filters[this.visibility](this.todos);
    },
    remaining: function() {
      return filters.active(this.todos).length;
    },
    allDone: {
      get: function() {
        return this.remaining === 0;
      },
      set: function(value) {
        this.todos.forEach(function(todo) {
          todo.completed = value;
        });
      }
    }
  },

  filters: {
    pluralize: function(n) {
      return n === 1 ? "item" : "items";
    }
  },

  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      });
      this.newTodo = "";
    },

    removeTodo: function(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit: function(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos);
    },

    setHash: function(filter) {
      window.location.hash = filter;
    }
  },

  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped lang="scss">
[v-cloak] {
  display: none;
}
.todo {
  &-Item {
    &-edit {
      display: none;
    }
  }
}
.editing {
  .todo-Item-edit {
    display: block;
  }
  .todo-Item-view {
    display: none;
  }
}
</style>
