<template>
  <header>Home</header>
  <main ref="container" />
</template>

<script>
import { ref, onMounted } from "vue";
import * as three from "three";
import * as dat from "dat.gui";
export default {
  setup() {
    const container = ref(null);
    onMounted(() => {
      console.log(container.value);
    });
    const initGui = () => {
      const gui = new dat.GUI({ name: "My GUI" });
      gui.add({ rotation: 0 }, "rotation", 0, 360);
    };
    onMounted(() => {
      initGui();
    });
    return {
      container,
    };
  },
};
</script>