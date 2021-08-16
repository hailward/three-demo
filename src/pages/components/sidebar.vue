<template>
  <el-aside
    :class="collapse ? 'collapsed' : ''"
    :style="{ width: collapse ? '65px' : '' }"
  >
    <div class="title">
      <div v-if="!collapse" style="flex: 1">
        <i class="el-icon-menu" />
        <span>&nbsp;&nbsp;</span>
        <span>导航菜单</span>
      </div>
      <el-button
        circle
        type="text"
        @click="toggleCollapse"
        :icon="collapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
      />
    </div>
    <el-menu
      text-color="#fff"
      :collapse="collapse"
      background-color="#545c64"
      :default-active="defaultActive"
    >
      <el-menu-item index="/" @click="routerTo('/')">
        <i class="el-icon-menu"></i>
        <span class="menu-item-title">Home</span>
      </el-menu-item>
      <el-menu-item
        index="/camera-with-gui"
        @click="routerTo('/camera-with-gui')"
      >
        <i class="el-icon-menu"></i>
        <span class="menu-item-title">Camera with GUI</span>
      </el-menu-item>
      <el-menu-item
        index="/geometries"
        @click="routerTo('/geometries')"
      >
        <i class="el-icon-menu"></i>
        <span class="menu-item-title">Geometries</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const collapse = ref(false);
    const toggleCollapse = () => {
      collapse.value = !collapse.value;
    };
    watch(collapse, () => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      });
    });

    const defaultActive = ref("");
    const route = useRoute();
    const router = useRouter();
    const routerTo = (path) => {
      router.push(path);
    };
    watchEffect(() => {
      defaultActive.value = route.path;
    });
    return {
      collapse,
      toggleCollapse,
      defaultActive,
      routerTo,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-aside {
  &.collapsed {
    .menu-item-title {
      display: none;
    }
  }
  color: #fff;
  background-color: #545c64;
  overflow: hidden;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
  }
  .el-menu {
    border: none;
  }
}
</style>