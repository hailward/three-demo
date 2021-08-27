import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 创建场景
export const createInstances = (container, showGrid = true) => {
  // scene/camera/renderer
  const { offsetWidth, offsetHeight } = container;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    offsetWidth / offsetHeight,
    0.1,
    1000
  );
  camera.position.set(0, 40, 80);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(offsetWidth, offsetHeight);
  renderer.setClearColor(0x222842, 1);
  container.appendChild(renderer.domElement);
  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  // helpers
  if (showGrid) {
    const grid = new THREE.GridHelper(100, 20);
    scene.add(grid);
  }
  return {
    scene,
    camera,
    renderer
  };
};
