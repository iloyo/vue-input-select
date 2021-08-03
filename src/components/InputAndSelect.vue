<template>
  <div style="width: inherit">
    <div class="parent" style="position: relative; width: inherit">
      <div class="select-input">
        <input
          class="inputDom"
          :placeholder="placeholder"
          v-model="value"
          type="text"
          autocomplete="off"
          @input="inputChange"
        />
        <div @click="changeIconDirection($event)" class="select-arrow">
          <i class="iconfont icon-unfold" :class="iconUnfoldClass"></i>
        </div>
      </div>
      <div
        class="select-dropdown"
        :style="{
          display: iconUnfoldClass['icon-unfold-transform'] ? 'block' : 'none',
        }"
      >
        <ul
          class="select-not-found"
          :style="{ display: !isExistedSelectData ? 'block' : 'none' }"
        >
          <li>无匹配数据</li>
        </ul>
        <ul
          class="select-dropdown-list"
          :style="{ display: isExistedSelectData ? 'block' : 'none' }"
        >
          <li
            @click="selectChange(item)"
            class="select-item"
            v-for="(item, index) in selectDataList"
            :key="index"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputAndSelect",
  props: {
    selectDataList: {
      type: Array,
      default: [],
      // 验证必须有label和value
      validator: function (value) {
        return value.every((item) => {
          return item.hasOwnProperty("label") && item.hasOwnProperty("value");
        });
      },
    },
    // value 与 this.$emit('input', this.value) 配合实现input 输入框 v-model双向绑定功能
    value: {
      type: String,
      default: "",
    },
    // 是否将下拉框加入到body的直接子节点中
    // 在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
    transfer: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  data() {
    return {
      iconUnfoldClass: {
        "icon-unfold-transform": false,
      },
      //记录点击切换按钮时对应的事件
      ev: null,
    };
  },
  methods: {
    //在输入框中改变值时才会触发,js改变输入框绑定的值不会触发
    inputChange() {
      console.log("inputValue改变了====", this.value);
      this.$emit("input", this.value);
      this.$emit("inputsChange", this.value);
    },
    //选择内容发生改变时触发
    selectChange(item) {
      this.value = item.value;
      this.iconUnfoldClass["icon-unfold-transform"] = false;
      this.$emit("input", this.value);
      this.$emit("selectChange", item);
    },
    changeIconDirection(e) {
      //点击切换图标按钮时，先保存当前点击的事件，在后面监听的click事件中，判断如果不是当前点击的事件，则收起下拉框
      this.ev = e;
      this.iconUnfoldClass["icon-unfold-transform"] = !this.iconUnfoldClass[
        "icon-unfold-transform"
      ];
      if (this.iconUnfoldClass["icon-unfold-transform"]) {
        this.checkTransfer();
        let inputDom = document.querySelector(".inputDom");
        inputDom.focus();
      }
    },
    checkTransfer() {
      if (this.transfer) {
        // 组件监听页面resize只能用addEventListener，否则不会生效
        window.addEventListener("resize", this.checkTransfer, false);
        // 监听scroll事件的事件传递必须使用捕获阶段，让外部元素事件先触发
        // document.addEventListener('scroll', this.checkTransfer, true)
        //window.innerHeight  document.documentElement.clientHeight 都是获取可是去高度
        //window.innerHeight获取的高度包含横向滚动条，而document.documentElement.clientHeight不包含横向滚动条
        let bodyHeight = document.documentElement.clientHeight; // body 可视区域高度
        let matchHeight = this.matchDom.clientHeight; // 匹配DOM的高度
        let rect = this.matchParent.getBoundingClientRect(); // 取出匹配父级DOM的矩形对象
        // getBoundingClientRect.bottom为元素下边与页面上边的距离，所以元素下边与页面下边距离 = 页面高度 - getBoundingClientRect.bottom
        let bottom = bodyHeight - rect.bottom;
        this.matchDom.style.left = rect.left + "px"; // 匹配DOM的left与父级一致
        let dropdownWidth = rect.width + "px"; //下拉框宽度与父级dom一致
        this.matchDom.style.width = dropdownWidth;
        if (bottom >= matchHeight) {
          // 父级距离页面下边的高度大于等于匹配DOM的高度，则往下展示
          this.matchDom.style.bottom = "auto";
          this.matchDom.style.top = rect.top + rect.height + "px"; // 匹配DOM的top = 父级矩形对象top + 父级的高度
        } else {
          // 父级距离页面下边的高度小于匹配DOM的高度，则往上展示
          this.matchDom.style.top = "auto";
          this.matchDom.style.bottom = bottom + rect.height + "px"; // 匹配DOM的bottom = 父级矩形对象bottom + 父级的高度
        }
      }
    },
    // 点击切换图标按钮以外的其他地方触发，关闭下拉框
    clickOther(e) {
      // 判断如果不是当前点击的事件，则收起下拉框
      if (this.ev === e) return;
      if (this.iconUnfoldClass["icon-unfold-transform"]) {
        this.iconUnfoldClass["icon-unfold-transform"] = false;
      }
    },
  },
  computed: {
    isExistedSelectData() {
      return this.selectDataList.length > 0 ? true : false;
    },
    matchDom() {
      // 匹配框，需要相对于body
      return this.$el.getElementsByClassName("select-dropdown")[0];
    },
    matchParent() {
      // 匹配框父级
      return this.$el.getElementsByClassName("parent")[0];
    },
  },
  created() {
    if (this.transfer) {
      // 将匹配的下拉框从原有位置移到body节点中
      this.$nextTick(() => {
        const body = document.querySelector("body");
        // 将匹配DOM添加到body中
        if (body.append) {
          // 在IE11中 document.appendChild会报错: javascript runtime error:HierarchyRequestError
          body.append(this.matchDom);
        } else {
          body.appendChild(this.matchDom);
        }
      });
    }
  },
  mounted() {
    window.addEventListener("click", this.clickOther);
  },
};
</script>

<style lang="scss" scoped>
.icon-unfold-transform {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.select-dropdown {
  position: absolute;
  z-index: 1060;
  will-change: top, left;
  visibility: visible;
  top: 28px;
  left: 0px;
  width: inherit;
  max-height: 210px;
  padding: 5px 0;
  margin: 5px 0;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  overflow: auto;
  .select-not-found {
    text-align: center;
    color: #999;
  }
  .select-dropdown-list {
    .select-item {
      height: 30px;
      line-height: 16px;
      display: flex;
      align-items: baseline;
      margin: 0;
      padding: 7px 12px;
      clear: both;
      color: #333;
      font-size: 12px;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
  }
}
.select-input:hover {
  border-color: #3597f5;
}
.select-input {
  width: inherit;
  height: 28px;
  position: relative;
  text-align: left;
  box-sizing: border-box;
  outline: 0;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #d7dde4;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  > input {
    width: 100%;
    vertical-align: top;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    padding: 0 24px 0 8px;
    font-size: 12px;
    outline: 0;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #333;
    background-color: transparent;
    position: relative;
  }
  .select-arrow {
    position: absolute;
    right: 0;
    top: -2px;
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    cursor: pointer;
    > i {
      font-size: 12px;
      color: #9ea7b4;
      transition: all 0.2s ease-in-out;
      display: block;
    }
  }
}
</style>