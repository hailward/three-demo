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
      radius: 25,
      tube: 5,
      radialSegments: 18,
      tubularSegments: 18,
      arc: Math.PI * 2,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { radius, tube, radialSegments, tubularSegments, arc } =
        paramsRef.value;
      const geometry = new THREE.TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        arc
      );
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00,
      });
      const object = new THREE.Mesh(geometry, material);
      const edges = createEdges(geometry);
      scene.add(object, edges);
      onInvalidate(() => {
        scene.remove(object, edges);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { radius, tube, radialSegments, tubularSegments, arc } =
        paramsRef.value;
      gui
        .add({ radius }, "radius", 5, 50)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radius = value;
        });
      gui
        .add({ tube }, "tube", 1, 10)
        .step(1)
        .onChange((value) => {
          paramsRef.value.tube = value;
        });
      gui
        .add({ radialSegments }, "radialSegments", 3, 36)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radialSegments = value;
        });
      gui
        .add({ tubularSegments }, "tubularSegments", 3, 36)
        .step(1)
        .onChange((value) => {
          paramsRef.value.tubularSegments = value;
        });
      gui.add({ arc }, "arc", 0, Math.PI * 2).onChange((value) => {
        paramsRef.value.arc = value;
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
