<!--
 * @Descripttion: 内容页
 * @version: V 1.0
 * @Author: wxw
 * @Date: 2020-10-18 21:38:22
--> 
<template>
  <div>
  </div>
</template>

<script>
import markdownIt from "markdown-it";
import emoji from "markdown-it-emoji";

export default {
  props: {
    content: {
      default: "",
      type: String
    },
    inline: {
      default: false,
      type: Boolean
    }
  },
  // 挂载
  mounted() {
    var md = new markdownIt().use(emoji);
    var result;
    if (this.inline) {
      result = md.renderInline(this.content);
    } else {
      result = md.render(this.content);
    }
    this.$el.innerHTML = result;
  }
};
</script>
<style>
</style>