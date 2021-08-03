<template>
  <a-select
    :disabled="getlistLoading"
    v-model="value"
    :show-search="true"
    :not-found-content="null"
    :show-arrow="false"
    :filter-option="true"
    :autoClearSearchValue="false"
    @search="handleSearch"
    @blur="handleBlur"
    @change="handleChange"
  >
    <a-select-option v-for="item in list" :key="item">
      {{ item }}</a-select-option
    >
  </a-select>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      list: ["11111", "22222", "33333", "44444", "55555"],
      value: "12313",
      getlistLoading: false,
    };
  },
  methods: {
    // 实现select选择框可下拉单选，也可输入赋值
    handleSearch(value) {
      this.handleChange(value);
    },
    handleChange(value) {
      this.value = value != null && value !== "" ? value : [];
    },
    handleBlur(value) {
      this.value = value;
      // if (this.list.indexOf(value) === -1) {
      //   this.list.push(value);
      // }
    },
  },
};
</script>
