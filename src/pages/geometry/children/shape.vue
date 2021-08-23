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
    const params = reactive({
      scale: 10,
      segments: 30,
    });
    const getHeartShape = (scale, segments) => {
      const points = [];
      const { degToRad } = THREE.MathUtils;
      for (let i = 0; i < 360; i += 360 / segments) {
        const rad = degToRad(i);
        const x = (2 * Math.sin(rad) + Math.sin(2 * rad)) * scale;
        const y = -(2 * Math.cos(rad) + Math.cos(2 * rad)) * scale;
        points.push(new THREE.Vector2(x, y));
      }
      return new THREE.Shape(points);
    };
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { scale, segments } = params;
      const shape = getHeartShape(scale, segments);
      const geometry = new THREE.ShapeGeometry(shape);
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
      gui.add(params, "scale", 1, 20).step(1);
      gui.add(params, "segments", 6, 60).step(6);
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
