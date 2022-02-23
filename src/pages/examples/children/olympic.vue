<template>
  <main class="main" ref="containerRef" />
</template>

<script>
import { ref, onMounted, defineComponent, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
      scene.fog = new THREE.Fog(0xffffff, 1, 1000);
      scene.background = new THREE.TextureLoader().load(
        "/images/examples/olympic/sky.jpg"
      );
      // const grid = new THREE.GridHelper(100, 10);
      // scene.add(grid);
      camera = new THREE.PerspectiveCamera(
        75,
        offsetWidth / offsetHeight,
        0.1,
        1000
      );
      camera.position.set(0, 30, 80);
      camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      controls.enableZoom = false;
      controls.maxPolarAngle = (Math.PI / 18) * 8;
      controls.minPolarAngle = (Math.PI / 18) * 3;
    };
    const createAmbientLight = () => {
      const light = new THREE.AmbientLight(0xcfffff);
      light.intensity = 0.5;
      scene.add(light);
    };
    const createDirectionalLight = () => {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(0, 16, 16);
      light.castShadow = true;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 40;
      light.shadow.camera.bottom = -40;
      light.shadow.camera.left = -40;
      light.shadow.camera.right = 40;
      scene.add(light);
    };
    const createFloor = () => {
      const geometry = new THREE.PlaneGeometry(1000, 1000);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xffffff
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      scene.add(plane);
    };
    const loadModel = () => {
      const loader = new GLTFLoader();
      loader.load("/models/examples/olympic/mascot/scene.gltf", (mesh) => {
        mesh.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            if (child.name === "Object_30") {
              child.material.metalness = 0.5;
              child.material.roughness = 0.8;
            }
            // 半透明外壳
            if (child.name === "Object_28") {
              child.material.transparent = true;
              child.material.opacity = 0.5;
              child.material.metalness = 0.2;
              child.material.roughness = 0;
              // child.material.refractionRatio = 1;
              // child.castShadow = true;
            }
          }
        });
        mesh.scene.scale.set(24, 24, 24);
        scene.add(mesh.scene);
      });
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
      createDirectionalLight();
      createFloor();
      loadModel();
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
