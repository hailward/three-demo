<template>
  <main class="main" ref="containerRef" />
</template>

<script>
import { ref, onMounted, defineComponent, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default defineComponent({
  setup() {
    const containerRef = ref(null);
    let container;
    let scene, camera, renderer;
    let controls;
    let interupt;
    const init = () => {
      container = containerRef.value;
      const { offsetWidth, offsetHeight } = container;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        offsetWidth / offsetHeight,
        0.1,
        1000
      );
      camera.position.set(0, 40, 80);
      camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
    };
    const createAmbientLight = () => {
      const light = new THREE.AmbientLight(0xffffff);
      light.intensity = 0.1;
      scene.add(light);
    };
    const createSpotLight = () => {
      const light = new THREE.SpotLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(100, 100, 100);
      light.castShadow = true;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      scene.add(light);
    };
    const createPlane = () => {
      const geometry = new THREE.PlaneGeometry(100, 100);
      const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xffffff
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      // plane.castShadow = true;
      scene.add(plane);
    };
    const createSphere = () => {
      const geometry = new THREE.SphereGeometry(5, 36, 18);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xccac00
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.y = 10;
      sphere.castShadow = true;
      scene.add(sphere);
    };
    const update = () => {
      if (interupt) return;
      requestAnimationFrame(update);
      renderer.render(scene, camera);
    };
    const handleResize = () => {
      const { offsetWidth, offsetHeight } = container;
      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(offsetWidth, offsetHeight);
    };
    onMounted(() => {
      init();
      createAmbientLight();
      createSpotLight();
      createPlane();
      createSphere();
      update();
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        interupt = true;
        window.removeEventListener("resize", handleResize);
      });
    });
    return {
      containerRef
    };
  }
});
</script>
