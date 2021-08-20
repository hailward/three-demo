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
      segments: 18,
      phiStart: 0,
      phiLength: Math.PI * 2,
      // custom
      func: "sin",
      radialScale: 2,
      radialSegments: 30,
    });
    const getPoints = (func, radialScale, radialSegments) => {
      const points = [];
      const { degToRad } = THREE.MathUtils;
      for (let i = 0; i <= 360; i += 360 / radialSegments) {
        const rad = degToRad(i * 2);
        const x = rad * radialScale;
        const y = Math[func](rad) * radialScale;
        points.push(new THREE.Vector2(x, y));
      }
      return points;
    };
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const {
        segments,
        phiStart,
        phiLength,
        func,
        radialScale,
        radialSegments,
      } = paramsRef.value;
      const points = getPoints(func, radialScale, radialSegments);
      const geometry = new THREE.LatheGeometry(
        points,
        segments,
        phiStart,
        phiLength
      );
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
      const {
        segments,
        phiStart,
        phiLength,
        func,
        radialScale,
        radialSegments,
      } = paramsRef.value;
      gui
        .add({ segments }, "segments", 3, 36)
        .step(1)
        .onChange((value) => {
          paramsRef.value.segments = value;
        });
      gui.add({ phiStart }, "phiStart", 0, Math.PI * 2).onChange((value) => {
        paramsRef.value.phiStart = value;
      });
      gui.add({ phiLength }, "phiLength", 0, Math.PI * 2).onChange((value) => {
        paramsRef.value.phiLength = value;
      });
      const customFolder = gui.addFolder("custom");
      customFolder.add({ func }, "func", ["sin", "cos"]).onChange((value) => {
        paramsRef.value.func = value;
      });
      customFolder
        .add({ radialScale }, "radialScale", 1, 4)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radialScale = value;
        });
      customFolder
        .add({ radialSegments }, "radialSegments", 6, 60)
        .step(6)
        .onChange((value) => {
          paramsRef.value.radialSegments = value;
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
