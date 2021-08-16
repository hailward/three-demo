<template>
  <el-container>
    <sidebar />
    <el-main>
      <slot />
    </el-main>
  </el-container>
</template>

<script>
import Sidebar from './sidebar.vue';
export default {
  components: {
    Sidebar
  },
}
</script>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  .el-main {
    padding: 0;
  }
}
</style>