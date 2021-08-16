<template>
  <layout>
    <section class="container">
      <main class="main" ref="containerRef" />
    </section>
  </layout>
</template>

<script lang="ts">
import {
  ref,
  shallowRef,
  onMounted,
  watchEffect,
  defineComponent,
  reactive,
} from "vue";
import * as THREE from "three";
import FontJSON from "three/examples/fonts/helvetiker_regular.typeface.json";
import * as dat from "dat.gui";
import { Layout } from "../components";

export default defineComponent({
  components: {
    Layout,
  },
  setup() {
    const containerRef = ref(null);
    const instanceRef = shallowRef({
      scene: null,
      camera: null,
      renderer: null,
    });
    // initialize scene/camera/renderer
    const initInstances = () => {
      const container = containerRef.value;
      const { offsetWidth, offsetHeight } = container;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        offsetWidth / offsetHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 0);
      camera.rotation.set(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      container.appendChild(renderer.domElement);
      instanceRef.value = { scene, camera, renderer };
      interuptRef.value = false;
    };
    // initialize renferences
    const initReferences = () => {
      const { scene } = instanceRef.value;
      const cube = new THREE.Mesh(
        new THREE.SphereGeometry(50, 50, 50),
        new THREE.MeshBasicMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        })
      );
      scene.add(cube);
      const createText = (text: string, color: number) => {
        var geometry = new THREE.TextGeometry(text, {
          font: new THREE.Font(FontJSON),
          size: 5,
          height: 0.5,
          // curveSegments: 12,
          // bevelEnabled: true,
          // bevelThickness: 10,
          // bevelSize: 8,
          // bevelSegments: 5,
        });
        geometry.computeBoundingBox();
        const material = new THREE.MeshBasicMaterial({ color });
        const textObj = new THREE.Mesh(geometry, material);
        textObj.position.x = -geometry.boundingBox.max.x / 2;
        textObj.position.y = -geometry.boundingBox.max.y / 2;
        textObj.position.z = -geometry.boundingBox.max.z / 2;
        const group = new THREE.Group();
        group.add(textObj);
        return group;
      };
      const texts = [
        createText("top", 0xff0000),
        createText("front", 0xffa500),
        createText("back", 0xffff00),
        createText("left", 0x00ff00),
        createText("right", 0x0000ff),
        createText("bottom", 0xe0ffff),
      ];
      texts[0].position.set(0, 50, 0);
      texts[0].rotation.set(Math.PI / 2, 0, 0);

      texts[1].position.set(0, 0, -50);

      texts[2].position.set(0, 0, 50);
      texts[2].rotation.set(0, Math.PI, 0);

      texts[3].position.set(-50, 0, 0);
      texts[3].rotation.set(0, Math.PI / 2, 0);

      texts[4].position.set(50, 0, 0);
      texts[4].rotation.set(0, -Math.PI / 2, 0);

      texts[5].position.set(0, -50, 0);
      texts[5].rotation.set(-Math.PI / 2, 0, 0);
      scene.add(...texts);
    };
    // render
    const render = () => {
      const { scene, camera, renderer } = instanceRef.value;
      renderer.render(scene, camera);
    };
    // loop update
    const interuptRef = ref(false);
    const update = () => {
      const interupt = interuptRef.value;
      if (interupt) return;
      requestAnimationFrame(update);
      render();
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
      watchEffect((onInvalidate) => {
        initInstances();
        initReferences();
        update();
        window.addEventListener("resize", handleResize);
        onInvalidate(() => {
          interuptRef.value = true;
          window.removeEventListener("resize", handleResize);
        });
      });
    });
    onMounted(() => {
      watchEffect((onInvalidate) => {
        const { camera } = instanceRef.value;
        if (!camera) return;
        const { rotation } = camera;
        const { degToRad, radToDeg } = THREE.MathUtils;
        const gui = new dat.GUI({ name: "My GUI" });
        gui
          .add(
            { rotationX: Math.round(radToDeg(rotation.x)) },
            "rotationX",
            -180,
            180
          )
          .onChange((value) => {
            camera.rotation.x = degToRad(value);
          });
        gui
          .add(
            { rotationY: Math.round(radToDeg(rotation.x)) },
            "rotationY",
            -180,
            180
          )
          .onChange((value) => {
            camera.rotation.y = degToRad(value);
          });
        gui
          .add(
            { rotationZ: Math.round(radToDeg(rotation.x)) },
            "rotationZ",
            -180,
            180
          )
          .onChange((value) => {
            camera.rotation.z = degToRad(value);
          });
        onInvalidate(() => {
          gui.destroy();
        });
      });
    });
    return {
      containerRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .status {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    padding: 10px;
  }
}
</style>