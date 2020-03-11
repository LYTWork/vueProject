<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '~@/style/main.scss'; // 公共样式
@import '~@/style/layout.scss'; // 布局排版样式
@import '~@/style/color-dark.scss';
@import '~@/style/self-adaption.scss'; // 各个分辨率下浏览器自适应
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
