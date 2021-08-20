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
  markRaw,
  toRaw,
} from "vue";
import * as THREE from "three";
import * as dat from "dat.gui";
import FontJSON from "three/examples/fonts/helvetiker_regular.typeface.json";
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
      text: "Three.js",
      parameters: {
        font: markRaw(new THREE.Font(FontJSON)),
        size: 20,
        height: 5,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelSegments: 1,
      },
    });
    watchEffect((onInvalidate) => {
      const { scene } = instanceRef.value;
      if (!scene) return;
      const { text, parameters } = paramsRef.value;
      const geometry = new THREE.TextGeometry(text, parameters);
      geometry.computeBoundingBox();
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00,
      });
      const object = new THREE.Mesh(geometry, material);
      const edges = createEdges(geometry);
      const group = createGroup(object, edges);
      group.position.x = -geometry.boundingBox.max.x / 2;
      group.position.y = -geometry.boundingBox.max.y / 2;
      group.position.z = -geometry.boundingBox.max.z / 2;
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const { text, parameters } = paramsRef.value;
      const {
        size,
        height,
        curveSegments,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelSegments,
      } = toRaw(parameters);
      gui.add({ text }, "text").onChange((value) => {
        paramsRef.value.text = value;
      });
      gui
        .add({ size }, "size", 1, 20)
        .onChange((value) => {
          parameters.size = value;
        });
      gui
        .add({ height }, "height", 1, 10)
        .onChange((value) => {
          parameters.height = value;
        });
      gui
        .add({ curveSegments }, "curveSegments", 1, 10)
        .step(1)
        .onChange((value) => {
          parameters.curveSegments = value;
        });
      gui.add({ bevelEnabled }, "bevelEnabled").onChange((value) => {
        parameters.bevelEnabled = value;
      });
      gui
        .add({ bevelThickness }, "bevelThickness", 0, 10)
        .step(1)
        .onChange((value) => {
          parameters.bevelThickness = value;
        });
      gui
        .add({ bevelSize }, "bevelSize", 0, 10)
        .step(1)
        .onChange((value) => {
          parameters.bevelSize = value;
        });
      gui
        .add({ bevelSegments }, "bevelSegments", 1, 10)
        .step(1)
        .onChange((value) => {
          parameters.bevelSegments = value;
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
