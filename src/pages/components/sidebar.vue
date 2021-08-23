<template>
  <el-aside
    :class="collapse ? 'collapsed' : ''"
    :style="{ width: collapse ? '65px' : '' }"
  >
    <div class="title">
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
      <el-menu
        text-color="#fff"
        :collapse="collapse"
        background-color="#545c64"
        :default-active="defaultActive"
      >
        <template v-for="one in routes">
          <el-submenu
            v-if="one.children && one.children.length"
            :key="one.path"
            :index="one.path"
            popper-class="sidebar-popper"
          >
            <template #title>
              <i v-if="collapse" class="el-icon-files" :title="one.name" />
              <span>{{ one.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="two in one.children"
                :key="`${one.path}/${two.path}`"
                :index="`${one.path}/${two.path}`"
                @click="router.push(`${one.path}/${two.path}`)"
              >
                {{ two.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :key="one.path" @click="router.push(one.path)">
            <i v-if="collapse" class="el-icon-position" :title="one.name" />
            <span v-else>{{ one.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
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

    const collapse = ref(window.collapse || false);
    const toggleCollapse = () => {
      window.collapse = !collapse.value;
      collapse.value = window.collapse;
    };
    watch(collapse, () => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      });
    });

    const defaultActive = ref("");
    const route = useRoute();
    const router = useRouter();
    const {
      options: { routes },
    } = router;
    onMounted(() => {
      defaultActive.value = route.path;
    });
    return {
      scrollbarHeight,
      collapse,
      toggleCollapse,
      defaultActive,
      router,
      routes,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-aside {
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
<style lang="scss">
.sidebar-popper.el-popper {
  border: none;
  overflow: auto;
  max-height: calc(100vh - 20px);
}
</style>
