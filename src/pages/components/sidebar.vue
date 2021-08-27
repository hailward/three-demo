<template>
  <template v-if="fixed">
    <el-button
      circle
      @click="toggleDrawer"
      icon="el-icon-d-arrow-left"
      style="position: fixed; right: 20px; bottom: 20px; z-index: 1"
    />
    <el-drawer v-model="drawer" :with-header="false" size="80%">
      <div class="el-drawer-title">
        <div style="flex: 1; margin-left: 16px">
          <span>导航菜单</span>
        </div>
        <el-button
          circle
          type="text"
          @click="toggleDrawer"
          icon="el-icon-d-arrow-right"
        />
      </div>
      <el-scrollbar :max-height="scrollbarHeight">
        <Menu />
      </el-scrollbar>
    </el-drawer>
  </template>
  <template v-else>
    <el-aside
      :class="collapse ? 'collapsed' : ''"
      :style="{ width: collapse ? '65px' : '' }"
    >
      <div class="el-aside-title">
        <div v-if="!collapse" style="flex: 1; margin-left: 16px">
          <span>导航菜单</span>
        </div>
        <el-button
          circle
          type="text"
          @click="toggleCollapse"
          :icon="collapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
        />
      </div>
      <el-scrollbar :max-height="scrollbarHeight">
        <Menu :collapse="collapse" />
      </el-scrollbar>
    </el-aside>
  </template>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import Menu from "./menu.vue";
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Menu
  },
  setup() {
    const scrollbarHeight = ref("100px");
    const getScrollbarHeight = () => {
      const { offsetHeight } = document.body;
      scrollbarHeight.value = `${offsetHeight - 56}px`;
    };
    onMounted(() => {
      getScrollbarHeight();
      window.addEventListener("resize", getScrollbarHeight);
      onBeforeUnmount(() => {
        window.removeEventListener("resize", getScrollbarHeight);
      });
    });

    const drawer = ref(false);
    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };
    const collapse = ref(window.SIDEBAR_COLLAPSE || false);
    const toggleCollapse = () => {
      window.SIDEBAR_COLLAPSE = !collapse.value;
      collapse.value = window.SIDEBAR_COLLAPSE;
    };
    watch(collapse, () => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      });
    });
    return {
      scrollbarHeight,
      drawer,
      toggleDrawer,
      collapse,
      toggleCollapse
    };
  }
};
</script>

<style lang="scss" scoped>
.el-drawer {
  &-title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    color: #fff;
    background-color: #545c64;
  }
  .el-scrollbar {
    background-color: #545c64;
  }
  .el-menu {
    border: none;
  }
}
.el-aside {
  overflow: hidden;
  &-title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    color: #fff;
    background-color: #545c64;
  }
  .el-scrollbar {
    background-color: #545c64;
  }
  .el-menu {
    border: none;
  }
}
</style>
<style lang="scss">
.sidebar-popper.el-popper {
  border: none;
  overflow: auto;
  max-height: calc(100vh - 20px);
}
</style>
