<template>
  <main class="main" ref="containerRef" />
</template>

<script lang="ts">
import {
  ref,
  onMounted,
  shallowRef,
  watchEffect,
  defineComponent,
  onBeforeUnmount,
} from "vue";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createInstances } from "./common";

export default defineComponent({
  setup() {
    const containerRef = ref(null);
    const instanceRef = shallowRef({
      scene: null,
      camera: null,
      renderer: null,
    });
    const interuptRef = ref(false);
    const update = () => {
      const interupt = interuptRef.value;
      if (interupt) return;
      requestAnimationFrame(update);
      const { scene, camera, renderer } = instanceRef.value;
      renderer.render(scene, camera);
    };
    const handleResize = () => {
      const container = containerRef.value;
      const { offsetWidth, offsetHeight } = container;
      const { camera, renderer } = instanceRef.value;
      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(offsetWidth, offsetHeight);
    };
    onMounted(() => {
      const container = containerRef.value;
      instanceRef.value = createInstances(container, false);
      requestAnimationFrame(update);
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        interuptRef.value = true;
        window.removeEventListener("resize", handleResize);
      });
    });
    const paramsRef = ref({
      size: 100,
      divisions: 10,
      color1: 0x444444,
      color2: 0x888888,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { size, divisions, color1, color2 } = paramsRef.value;
      const object = new THREE.GridHelper(size, divisions, color1, color2);
      scene.add(object);
      onInvalidate(() => {
        scene.remove(object);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { size, divisions, color1, color2 } = paramsRef.value;
      gui
        .add({ size }, "size", 10, 100)
        .step(1)
        .onChange((value) => {
          paramsRef.value.size = value;
        });
      gui
        .add({ divisions }, "divisions", 10, 100)
        .step(2)
        .onChange((value) => {
          paramsRef.value.divisions = value;
        });
      gui
        .addColor({ color1 }, "color1")
        .onChange((value) => {
          paramsRef.value.color1 = value;
        });
      gui
        .addColor({ color2 }, "color2")
        .onChange((value) => {
          paramsRef.value.color2 = value;
        });
      onBeforeUnmount(() => {
        gui.destroy();
      });
    });
    return {
      containerRef,
    };
  },
});
</script>