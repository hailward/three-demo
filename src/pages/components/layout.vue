<template>
  <el-container>
    <SideBar :fixed="fixed" />
    <el-main>
      <slot />
    </el-main>
  </el-container>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from "vue";
import SideBar from "./sidebar.vue";
export default {
  components: {
    SideBar,
  },
  setup() {
    const scrollbarHeight = ref("100px");
    const getScrollbarHeight = () => {
      const { offsetHeight } = document.body;
      scrollbarHeight.value = `${offsetHeight - 56}px`;
    };
    getScrollbarHeight();
    onMounted(() => {
      window.addEventListener("resize", getScrollbarHeight);
      onBeforeUnmount(() => {
        window.removeEventListener("resize", getScrollbarHeight);
      });
    });

    const fixed = ref(window.SIDEBAR_FIXED || false);
    const handleResize = () => {
      const { offsetWidth } = document.body;
      if (offsetWidth < 800) {
        window.SIDEBAR_FIXED = true;
      } else {
        window.SIDEBAR_FIXED = false;
      }
      if (window.SIDEBAR_FIXED !== fixed.value) {
        fixed.value = window.SIDEBAR_FIXED;
      }
    };
    handleResize();
    onMounted(() => {
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        window.removeEventListener("resize", handleResize);
      });
    });
    return {
      scrollbarHeight,
      fixed,
    };
  },
};
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
