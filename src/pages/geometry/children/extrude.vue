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
  toRaw,
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
      options: {
        steps: 5,
        depth: 20,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
      },
      // custom
      radialScale: 10,
      radialSegments: 18,
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
      const { options, radialScale, radialSegments } = paramsRef.value;
      const shape = getShape(radialScale, radialSegments);
      const geometry = new THREE.ExtrudeGeometry(shape, options);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00,
      });
      const object = new THREE.Mesh(geometry, material);
      const edges = createEdges(geometry);
      const group = new THREE.Group();
      group.add(object, edges);
      group.position.z = -options.depth / 2;
      scene.add(group);
      onInvalidate(() => {
        scene.remove(group);
      });
    });
    onMounted(() => {
      const gui = new dat.GUI({ name: "My GUI" });
      const {
        options,
        // custom
        radialScale,
        radialSegments,
      } = paramsRef.value;
      const {
        steps,
        depth,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments,
      } = toRaw(options);
      gui
        .add({ steps }, "steps", 1, 10)
        .step(1)
        .onChange((value) => {
          options.steps = value;
        });
      gui
        .add({ depth }, "depth", 0, 100)
        .step(1)
        .onChange((value) => {
          options.depth = value;
        });
      gui.add({ bevelEnabled }, "bevelEnabled").onChange((value) => {
        options.bevelEnabled = value;
      });
      gui
        .add({ bevelThickness }, "bevelThickness", 0, 100)
        .step(1)
        .onChange((value) => {
          options.bevelThickness = value;
        });
      gui
        .add({ bevelSize }, "bevelSize", -50, 50)
        .step(1)
        .onChange((value) => {
          options.bevelSize = value;
        });
      gui
        .add({ bevelOffset }, "bevelOffset", -50, 50)
        .step(1)
        .onChange((value) => {
          options.bevelOffset = value;
        });
      gui
        .add({ bevelSegments }, "bevelSegments", 1, 10)
        .step(1)
        .onChange((value) => {
          options.bevelSegments = value;
        });
      const customFolder = gui.addFolder("custom");
      customFolder
        .add({ radialScale }, "radialScale", 1, 50)
        .step(1)
        .onChange((value) => {
          paramsRef.value.radialScale = value;
        });
      customFolder
        .add({ radialSegments }, "radialSegments", 6, 36)
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
