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
    const createSphere = () => {
      const { scene } = instanceRef.value;
      const geometry = new THREE.SphereGeometry(10, 36, 18);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
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
      createSphere();
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
        y: 50,
        z: 0
      },
      color: 0xffffff,
      intensity: 1,
      distance: 50,
      decay: 0.5,
      shpereSize: 10
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { position, color, intensity, distance, decay, shpereSize } =
        params;
      const light = new THREE.PointLight(color, intensity, distance, decay);
      light.position.set(position.x, position.y, position.z);
      const helper = new THREE.PointLightHelper(light, shpereSize);
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
      gui.addColor(params, "color");
      gui.add(params, "intensity", 0, 1);
      gui.add(params, "distance", 1, 100).step(1);
      gui.add(params, "decay", 0, 1);
      gui.add(params, "shpereSize", 1, 20).step(1);
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
