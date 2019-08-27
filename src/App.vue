<template>
  <div id="app">
    <TodoList title="Things to do today" v-bind:visibility="visibility" />
  </div>
</template>

<script>
import TodoList from "./components/TodoList.vue";

export default {
  name: "app",
  props: {
    visibility: String
  },
  components: {
    TodoList
  }
};
</script>

<style lang="scss">
</style>
