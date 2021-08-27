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
import { createGroup } from "@/utils/three";
import { createInstances, createEdges } from "./common";

export default defineComponent({
  setup() {
    const containerRef = ref(null);
    const instanceRef = shallowRef({
      scene: null,
      camera: null,
      renderer: null
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
      options: {
        steps: 5,
        depth: 20,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      },
      // custom
      radialScale: 10,
      radialSegments: 18
    });
    const getShape = (radialScale, radialSegments) => {
      const points = [];
      const { degToRad } = THREE.MathUtils;
      for (let i = 0; i <= 360; i += 360 / radialSegments) {
        const rad = degToRad(i);
        const x = Math.cos(rad) * radialScale;
        const y = Math.sin(rad) * radialScale;
        points.push(new THREE.Vector2(x, y));
      }
      return new THREE.Shape(points);
    };
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { options, radialScale, radialSegments } = params;
      const shape = getShape(radialScale, radialSegments);
      const geometry = new THREE.ExtrudeGeometry(shape, options);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00
      });
      const object = new THREE.Mesh(geometry, material);
      const edges = createEdges(geometry);
      const group = createGroup(object, edges);
      group.position.z = -options.depth / 2;
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { options } = params;
      gui.add(options, "steps", 1, 10).step(1);
      gui.add(options, "depth", 0, 100).step(1);
      gui.add(options, "bevelEnabled");
      gui.add(options, "bevelThickness", 0, 100).step(1);
      gui.add(options, "bevelSize", -50, 50).step(1);
      gui.add(options, "bevelOffset", -50, 50).step(1);
      gui.add(options, "bevelSegments", 1, 10).step(1);
      const customFolder = gui.addFolder("custom");
      customFolder.add(params, "radialScale", 1, 50).step(1);
      customFolder.add(params, "radialSegments", 6, 36).step(6);
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
