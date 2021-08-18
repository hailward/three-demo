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
      innerRadius: 15,
      outerRadius: 25,
      thetaSegments: 18,
      phiSegments: 5,
      thetaStart: 0,
      thetaLength: Math.PI * 2,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const {
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength,
      } = paramsRef.value;
      const geometry = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength
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
      const {
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength,
      } = paramsRef.value;
      gui
        .add({ innerRadius }, "innerRadius", 5, 50)
        .step(1)
        .onChange((value) => {
          paramsRef.value.innerRadius = value;
        });
      gui
        .add({ outerRadius }, "outerRadius", 5, 50)
        .step(1)
        .onChange((value) => {
          paramsRef.value.outerRadius = value;
        });
      gui
        .add({ thetaSegments }, "thetaSegments", 3, 36)
        .step(1)
        .onChange((value) => {
          paramsRef.value.thetaSegments = value;
        });
      gui
        .add({ phiSegments }, "phiSegments", 1, 10)
        .step(1)
        .onChange((value) => {
          paramsRef.value.phiSegments = value;
        });
      gui
        .add({ thetaStart }, "thetaStart", 0, Math.PI * 2)
        .onChange((value) => {
          paramsRef.value.thetaStart = value;
        });
      gui
        .add({ thetaLength }, "thetaLength", 0, Math.PI * 2)
        .onChange((value) => {
          paramsRef.value.thetaLength = value;
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
