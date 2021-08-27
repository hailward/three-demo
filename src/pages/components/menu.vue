<template>
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
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const defaultActive = ref("");
    const route = useRoute();
    const router = useRouter();
    const {
      options: { routes }
    } = router;
    onMounted(() => {
      defaultActive.value = route.path;
    });
    return {
      defaultActive,
      router,
      routes
    };
  }
};
</script>
