<template>
  <div class="box box2">
    <slot name="content"></slot>
    <!-- 装饰 -->
    <div class="horn"></div>
    <div class="horn horn2"></div>
    <!-- 流光 -->
    <div class="flow">
      <div class="flow-light flow-top"></div>
      <div class="flow-light flow-right"></div>
      <div class="flow-light flow-bottom"></div>
      <div class="flow-light flow-left"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'box',
  props: {
    title: {
      type: String,
      default: '项目名称'
    },
  },
  data() {
    return {}
  }
}
</script>

<style scoped></style>