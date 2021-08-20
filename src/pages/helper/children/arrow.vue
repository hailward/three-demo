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
  toRaw,
  reactive,
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
      dir: {
        x: 0,
        y: 50,
        z: 0,
      },
      origin: {
        x: 0,
        y: 0,
        z: 0,
      },
      length: 50,
      hex: 0xffff00,
      headLength: 5,
      headWidth: 1,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { dir, origin, length, hex, headLength, headWidth } = params;
      const object = new THREE.ArrowHelper(
        new THREE.Vector3(dir.x, dir.y, dir.z).normalize(),
        new THREE.Vector3(origin.x, origin.y, origin.z),
        length,
        hex,
        headLength,
        headWidth
      );
      scene.add(object);
      onInvalidate(() => {
        scene.remove(object);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { dir, origin, length, hex, headLength, headWidth } = params;
      const rawDir = { ...toRaw(dir) };
      const dirFolder = gui.addFolder("dir");
      dirFolder
        .add(rawDir, "x", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.x = value;
        });
      dirFolder
        .add(rawDir, "y", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.y = value;
        });
      dirFolder
        .add(rawDir, "z", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.z = value;
        });
      const rawOrigin = { ...toRaw(origin) };
      const originFolder = gui.addFolder("origin");
      originFolder
        .add(rawOrigin, "x", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.x = value;
        });
      originFolder
        .add(rawOrigin, "y", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.y = value;
        });
      originFolder
        .add(rawOrigin, "z", -50, 50)
        .step(1)
        .onChange((value) => {
          dir.z = value;
        });
      gui
        .add({ length }, "length", 1, 50)
        .step(1)
        .onChange((value) => {
          params.length = value;
        });
      gui.addColor({ hex }, "hex").onChange((value) => {
        params.hex = value;
      });
      gui
        .add({ headLength }, "headLength", 1, 10)
        .step(1)
        .onChange((value) => {
          params.headLength = value;
        });
      gui
        .add({ headWidth }, "headWidth", 1, 10)
        .step(1)
        .onChange((value) => {
          params.headWidth = value;
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