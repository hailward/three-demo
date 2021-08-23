<template>
  <main class="main" ref="containerRef" />
</template>

<script lang="ts">
import {
  ref,
  reactive,
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
      instanceRef.value = createInstances(container);
      requestAnimationFrame(update);
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        interuptRef.value = true;
        window.removeEventListener("resize", handleResize);
      });
    });
    const params = reactive({
      position: {
        x: 0,
        y: 10,
        z: 50,
      },
      size: 10,
      color: 0xffffff,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { position, size, color } = params;
      console.log(position);
      const light = new THREE.DirectionalLight(color);
      light.position.set(position.x, position.y, position.z);
      const helper = new THREE.DirectionalLightHelper(light, size);
      scene.add(light, helper);
      onInvalidate(() => {
        scene.remove(light, helper);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { position } = params;
      const positionFolder = gui.addFolder("position");
      positionFolder.add(position, "x", -50, 50).step(1);
      positionFolder.add(position, "y", -50, 50).step(1);
      positionFolder.add(position, "z", -50, 50).step(1);
      gui.add(params, "size", 1, 20).step(1);
      gui.addColor(params, "color");
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