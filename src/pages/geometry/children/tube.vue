<template>
  <main class="main" ref="containerRef" />
</template>

<script lang="ts">
import {
  ref,
  reactive,
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
    const params = reactive({
      tubularSegments: 50,
      radius: 2,
      radialSegments: 18,
      closed: false,
      // custom params
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
      } = params;
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
      const group = createGroup(object, edges);
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      gui.add(params, "tubularSegments", 10, 100).step(1);
      gui.add(params, "radius", 1, 10).step(1);
      gui.add(params, "radialSegments", 3, 36).step(1);
      gui.add(params, "closed");
      const customFolder = gui.addFolder("custom");
      customFolder.add(params, "scaleX", 10, 100);
      customFolder.add(params, "scaleY", -20, 20);
      customFolder.add(params, "scaleZ", -20, 20);
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
