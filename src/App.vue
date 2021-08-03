<template>
  <div id="app">
    <!-- <HelloWorld /> -->
    <InputAndSelect :value="value" @input="handleInput" />
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import InputAndSelect from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    // HelloWorld,
    InputAndSelect,
  },
  data() {
    return {
      value: "aaaaaaaaaa",
    };
  },
  methods: {
    handleInput(value) {
      this.value = value;
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
