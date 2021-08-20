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
import { createGroup } from "@/utils/three";
import { createInstances, createEdges } from "./common";

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
    const paramsRef = ref({
      width: 50,
      height: 50,
      depth: 50,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { width, height, depth } = paramsRef.value;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00,
      });
      const object = new THREE.Mesh(geometry, material);
      const edges = createEdges(geometry);
      const group = createGroup(object, edges);
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { width, height, depth } = paramsRef.value;
      gui
        .add({ width }, "width", 10, 100)
        .step(1)
        .onChange((value) => {
          paramsRef.value.width = value;
        });
      gui
        .add({ height }, "height", 10, 100)
        .step(1)
        .onChange((value) => {
          paramsRef.value.height = value;
        });
      gui
        .add({ depth }, "depth", 10, 100)
        .step(1)
        .onChange((value) => {
          paramsRef.value.depth = value;
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