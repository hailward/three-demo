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
      tubularSegments: 50,
      radius: 2,
      radialSegments: 18,
      closed: false,
      scaleX: 100,
      scaleY: 20,
      scaleZ: 20,
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const {
        tubularSegments,
        radius,
        radialSegments,
        closed,
        scaleX,
        scaleY,
        scaleZ,
      } = paramsRef.value;
      const path = new THREE.Curve<THREE.Vector3>();
      path.getPoint = function (t) {
        const tx = t * scaleX - scaleX / 2;
        const ty = Math.sin(Math.PI * 4 * t) * scaleY;
        const tz = Math.cos(Math.PI * 4 * t) * scaleZ;
        return new THREE.Vector3(tx, ty, tz);
      };
      const geometry = new THREE.TubeGeometry(
        path,
        tubularSegments,
        radius,
        radialSegments,
        closed
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
        tubularSegments,
        radius,
        radialSegments,
        closed,
        scaleX,
        scaleY,
        scaleZ,
      } = paramsRef.value;
      gui
        .add({ tubularSegments }, "tubularSegments", 10, 100)
        .step(1)
        .onChange((value) => {
          paramsRef.value.tubularSegments = value;
        });
      gui
        .add({ radius }, "radius", 1, 10)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radius = value;
        });
      gui
        .add({ radialSegments }, "radialSegments", 3, 36)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radialSegments = value;
        });
      gui.add({ closed }, "closed").onChange((value) => {
        paramsRef.value.closed = value;
      });
      gui.add({ scaleX }, "scaleX", 10, 100).onChange((value) => {
        paramsRef.value.scaleX = value;
      });
      gui.add({ scaleY }, "scaleY", -20, 20).onChange((value) => {
        paramsRef.value.scaleY = value;
      });
      gui.add({ scaleZ }, "scaleZ", -20, 20).onChange((value) => {
        paramsRef.value.scaleZ = value;
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
