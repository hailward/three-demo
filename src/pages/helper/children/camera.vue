<template>
  <main class="main" ref="containerRef" />
</template>

<script>
import {
  ref,
  onMounted,
  shallowRef,
  defineComponent,
  onBeforeUnmount
} from "vue";
import * as THREE from "three";
import { createInstances } from "./common";

export default defineComponent({
  setup() {
    const containerRef = ref(null);
    const instanceRef = shallowRef({
      scene: null,
      camera: null,
      renderer: null
    });
    const createCameraHelper = () => {
      const { scene, camera } = instanceRef.value;
      const helper = new THREE.CameraHelper(camera);
      scene.add(helper);
    };
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
      createCameraHelper();
      requestAnimationFrame(update);
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        interuptRef.value = true;
        window.removeEventListener("resize", handleResize);
      });
    });
    return {
      containerRef
    };
  }
});
</script>
