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
      radialSegments: 50,
      tubularSegments: 18,
      p: 2,
      q: 3,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { radius, tube, radialSegments, tubularSegments, p, q } =
        paramsRef.value;
      const geometry = new THREE.TorusKnotGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        p,
        q
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
      const { radius, tube, radialSegments, tubularSegments, p, q } =
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
        .add({ radialSegments }, "radialSegments", 10, 100)
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
      gui
        .add({ p }, "p", 1, 10)
        .step(1)
        .onChange((value) => {
          paramsRef.value.p = value;
        });
      gui
        .add({ q }, "q", 1, 9)
        .step(1)
        .onChange((value) => {
          paramsRef.value.q = value;
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
