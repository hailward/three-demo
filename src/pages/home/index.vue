<template>
  <layout>
    <section class="container">
      <main class="main" ref="containerRef" />
      <div class="status">
        <div>
          <p>Camera position</p>
          <p>positionX: {{ cameraRef.position.x.toFixed(0) }}</p>
          <p>positionY: {{ cameraRef.position.y.toFixed(0) }}</p>
          <p>positionZ: {{ cameraRef.position.z.toFixed(0) }}</p>
        </div>
        <div>
          <p>Camera rotation</p>
          <p>
            rotationX:
            {{ ((cameraRef.rotation.x / Math.PI) * 180).toFixed(0) }}°
          </p>
          <p>
            rotationY:
            {{ ((cameraRef.rotation.y / Math.PI) * 180).toFixed(0) }}°
          </p>
          <p>
            rotationZ:
            {{ ((cameraRef.rotation.z / Math.PI) * 180).toFixed(0) }}°
          </p>
        </div>
      </div>
    </section>
  </layout>
</template>

<script>
import { ref, onMounted, defineComponent, onBeforeUnmount } from "vue";
import * as THREE from "three";
import FontJSON from "three/examples/fonts/helvetiker_regular.typeface.json";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import { Layout } from "../components";

export default defineComponent({
  components: {
    Layout
  },
  setup() {
    const containerRef = ref(null);
    let container;
    let scene, camera, renderer;
    let controls;
    let stats;
    let interupt;
    const cameraRef = ref({
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    });
    // initialize scene/camera/renderer
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
      camera.position.set(0, 50, 100);
      camera.lookAt(0, 0, 0);
      cameraRef.value = { ...camera };
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      container.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener("change", () => {
        cameraRef.value = { ...camera };
      });
      // 限制俯仰角
      // controls.minPolarAngle = Math.PI * (60 / 180);
      // controls.maxPolarAngle = Math.PI * (80 / 180);
      // controls.maxPolarAngle = Math.PI * (90 / 180);
      // 启用阻尼
      // controls.enableDamping = true
      // controls.dampingFactor = .01
      // 监听按键
      // controls.listenToKeyEvents(document.body);
      // controls.keys = {
      //   LEFT: "ArrowLeft", //left arrow
      //   UP: "ArrowUp", // up arrow
      //   RIGHT: "ArrowRight", // right arrow
      //   BOTTOM: "ArrowDown", // down arrow
      // };
      // 监听鼠标
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
        // RIGHT: THREE.MOUSE.PAN,
      };
      // 监听触摸
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    };
    // initialize renferences
    const initReferences = () => {
      const gridWidth = 100;
      const grid = new THREE.GridHelper(gridWidth, 10);
      scene.add(grid);
      // const axes = new THREE.AxesHelper(gridWidth / 2 + 5);
      // scene.add(axes);
      const arrows = [
        new THREE.ArrowHelper(
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 0, 0),
          gridWidth / 2 + 5,
          0xff0000,
          4
        ),
        new THREE.ArrowHelper(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, 0),
          gridWidth / 2 + 5,
          0xffff00,
          4
        ),
        new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 0, 0),
          gridWidth / 2 + 5,
          0x0000ff,
          4
        )
      ];
      scene.add(...arrows);
      const createText = (text, color) => {
        const geometry = new THREE.TextGeometry(text, {
          font: new THREE.Font(FontJSON),
          size: 5,
          height: 0.5
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
        return textObj;
      };
      const textX = createText("X", 0xff0000);
      textX.position.x = gridWidth / 2 + 6;
      const textY = createText("Y", 0xffff00);
      textY.position.y = gridWidth / 2 + 6;
      const textZ = createText("Z", 0x0000ff);
      const wrappedTextZ = new THREE.Group();
      wrappedTextZ.add(textZ);
      wrappedTextZ.position.z +=
        gridWidth / 2 + 6 + textZ.geometry.boundingBox.max.y / 2;
      wrappedTextZ.rotation.x = -Math.PI / 2;
      scene.add(textX, textY, wrappedTextZ);
    };
    const initStats = () => {
      stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      stats.dom.style.left = "unset";
      stats.dom.style.right = 0;
    };
    // loop update
    const update = () => {
      if (interupt) return;
      stats.begin();
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(update);
    };
    const handleResize = () => {
      const container = containerRef.value;
      const { offsetWidth, offsetHeight } = container;
      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(offsetWidth, offsetHeight);
    };
    onMounted(() => {
      init();
      initReferences();
      initStats();
      update();
      window.addEventListener("resize", handleResize);
      onBeforeUnmount(() => {
        interupt = true;
        document.body.removeChild(stats.dom);
        window.removeEventListener("resize", handleResize);
      });
    });
    return {
      containerRef,
      cameraRef
    };
  }
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
    top: 10px;
    left: 10px;
    color: #fff;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
}
</style>
