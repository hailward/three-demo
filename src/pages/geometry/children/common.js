import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 创建场景
export const createInstances = (container) => {
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
  const grid = new THREE.GridHelper(100, 20);
  const arrows = [
    new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      55,
      0xff0000,
      4
    ),
    new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      55,
      0xffff00,
      4
    ),
    new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      55,
      0x0000ff,
      4
    ),
  ];
  // lights
  const lights = [new THREE.DirectionalLight(0xffffff, 1)];
  lights[0].position.set(0, 100, 500);
  // add to scene
  scene.add(grid, ...arrows, ...lights);
  return {
    scene,
    camera,
    renderer,
  };
};
// 创建边界线
export const createEdges = (geometry) => {
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
  });
  return new THREE.LineSegments(edges, material);
};
