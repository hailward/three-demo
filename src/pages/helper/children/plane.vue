<template>
  <main class="main" ref="containerRef" />
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  shallowRef,
  watchEffect,
  defineComponent,
  onBeforeUnmount
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
      renderer: null
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
      dir: {
        x: 0,
        y: 50,
        z: 0
      },
      distance: 0,
      size: 50,
      color: 0xffffff
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { dir, distance, size, color } = params;
      const plane = new THREE.Plane(
        new THREE.Vector3(dir.x, dir.y, dir.z).normalize(),
        distance
      );
      const helper = new THREE.PlaneHelper(plane, size, color);
      scene.add(helper);
      onInvalidate(() => {
        scene.remove(helper);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { dir } = params;
      const dirFolder = gui.addFolder("dir");
      dirFolder.add(dir, "x", -50, 50).step(1);
      dirFolder.add(dir, "y", -50, 50).step(1);
      dirFolder.add(dir, "z", -50, 50).step(1);
      gui.add(params, "distance", -50, 50).step(1);
      gui.add(params, "size", 10, 100).step(1);
      gui.addColor(params, "color");
      onBeforeUnmount(() => {
        gui.destroy();
      });
    });
    return {
      containerRef
    };
  }
});
</script>
