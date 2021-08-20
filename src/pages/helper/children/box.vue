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
import { createGroup } from "@/utils/three";

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
      radius: 25,
      color: 0xffff00,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { radius, color } = paramsRef.value;
      const sphereGeometry = new THREE.SphereGeometry(radius, 36, 18);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      const object = new THREE.BoxHelper(sphere, color);
      const group = createGroup(sphere, object);
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { radius, color } = paramsRef.value;
      gui
        .add({ radius }, "radius", 5, 50)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radius = value;
        });
      gui.addColor({ color }, "color").onChange((value) => {
        paramsRef.value.color = value;
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