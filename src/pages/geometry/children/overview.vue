<template>
  <main class="main" ref="containerRef" />
</template>

<script lang="ts">
import { ref, shallowRef, onMounted, watchEffect, defineComponent } from "vue";
import * as THREE from "three";
import FontJSON from "three/examples/fonts/helvetiker_regular.typeface.json";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

export default defineComponent({
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
      camera.position.set(0, 25, 150);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      container.appendChild(renderer.domElement);
      instanceRef.value = { scene, camera, renderer };
      interuptRef.value = false;
    };
    const initLights = () => {
      const { scene } = instanceRef.value;
      const lights = [new THREE.DirectionalLight(0xffffff, 1)];
      lights[0].position.set(0, 50, 200);
      scene.add(...lights);
    };
    // initialize controls
    const initControls = () => {
      const { camera, renderer } = instanceRef.value;
      new OrbitControls(camera, renderer.domElement);
    };
    // initialize renferences
    const initReferences = () => {
      const { scene } = instanceRef.value;
      const gridWidth = 200;
      const grid = new THREE.GridHelper(gridWidth, 40);
      scene.add(grid);
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
        ),
      ];
      scene.add(...arrows);
    };
    const groupRef = shallowRef(null);
    const initGeometries = () => {
      const { scene } = instanceRef.value;
      const material = new THREE.MeshPhongMaterial({
        color: 0xccac00,
        side: THREE.DoubleSide,
      });
      const geometries = [];
      // plane: 平面几何体
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const plane = new THREE.Mesh(planeGeometry, material);
      geometries.push(plane);
      // tetrahedron: 四面体
      const tetrahedronGeometry = new THREE.TetrahedronGeometry(5, 0);
      const tetrahedron = new THREE.Mesh(tetrahedronGeometry, material);
      geometries.push(tetrahedron);
      // box: 立方体
      const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      const box = new THREE.Mesh(boxGeometry, material);
      geometries.push(box);
      // octahedron: 八面集合体
      const octahedronGeometry = new THREE.OctahedronGeometry(5, 0);
      const octahedron = new THREE.Mesh(octahedronGeometry, material);
      geometries.push(octahedron);
      // dodecahedron: 十二面体
      const dodecahedronGeometry = new THREE.DodecahedronGeometry(5, 0);
      const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material);
      geometries.push(dodecahedron);
      // icosahedron: 二十面体
      const icosahedronGeometry = new THREE.IcosahedronGeometry(5, 0);
      const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
      geometries.push(icosahedron);
      // sphere: 球几何体
      const sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
      const sphere = new THREE.Mesh(sphereGeometry, material);
      geometries.push(sphere);
      // ring: 圆环几何体
      const ringGeometry = new THREE.RingGeometry(2, 5, 6);
      const ring = new THREE.Mesh(ringGeometry, material);
      geometries.push(ring);
      // circle: 圆形
      const circleGeometry = new THREE.CircleGeometry(5, 18);
      const circle = new THREE.Mesh(circleGeometry, material);
      geometries.push(circle);
      // 圆锥
      const coneGeometry = new THREE.ConeGeometry(5, 10, 18);
      const cone = new THREE.Mesh(coneGeometry, material);
      geometries.push(cone);
      // cylinder: 圆柱
      const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 18);
      const cylinder = new THREE.Mesh(cylinderGeometry, material);
      geometries.push(cylinder);
      // torus: 圆环
      const torusGeometry = new THREE.TorusGeometry(5, 1, 6, 18);
      const torus = new THREE.Mesh(torusGeometry, material);
      geometries.push(torus);
      // torusKnot: 圆环扭结几何体
      const torusKnotGeometry = new THREE.TorusKnotGeometry(5, 1, 50, 6);
      const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
      geometries.push(torusKnot);
      // tube: 管道几何体
      const tubePath = new THREE.Curve<THREE.Vector3>();
      tubePath.getPoint = function (t) {
        const tx = t * 10 - 5;
        const ty = Math.sin(Math.PI * 4 * t) * 5;
        const tz = Math.cos(Math.PI * 4 * t) * 5;
        return new THREE.Vector3(tx, ty, tz);
      };
      const tubeGeometry = new THREE.TubeGeometry(tubePath, 20, 1, 18, false);
      const tube = new THREE.Mesh(tubeGeometry, material);
      geometries.push(tube);
      // text: 文本几何体
      const textGeometry = new THREE.TextGeometry("Hello", {
        font: new THREE.Font(FontJSON),
        size: 10,
        height: 1,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 1,
      });
      const text = new THREE.Mesh(textGeometry, material);
      geometries.push(text);
      // shape: 形状几何体
      const heartPoints = [];
      for (let i = 0; i < 360; i += 10) {
        const rad = THREE.MathUtils.degToRad(i);
        const x = (2 * Math.sin(rad) + Math.sin(2 * rad)) * 5;
        const y = -(2 * Math.cos(rad) + Math.cos(2 * rad)) * 5;
        heartPoints.push(new THREE.Vector2(x, y));
      }
      const heartShape = new THREE.Shape(heartPoints);
      const shapeGeometry = new THREE.ShapeGeometry(heartShape);
      const shape = new THREE.Mesh(shapeGeometry, material);
      geometries.push(shape);
      // lathe: 车削集合体
      const lathePoints = [];
      for (let i = 0; i <= Math.PI * 4; i += Math.PI / 6) {
        lathePoints.push(new THREE.Vector2(i, Math.cos(i)));
      }
      const latheGeometry = new THREE.LatheGeometry(lathePoints);
      const lathe = new THREE.Mesh(latheGeometry, material);
      geometries.push(lathe);
      // extrude: 挤压几何体
      const extrudeShape = new THREE.Shape();
      extrudeShape.moveTo(5, 0);
      for (let i = 360 / 6; i <= 360; i += 360 / 6) {
        const rad = THREE.MathUtils.degToRad(i);
        extrudeShape.lineTo(Math.cos(rad) * 5, Math.sin(rad) * 5);
      }
      const extrudeSetting = {
        steps: 1,
        depth: 10,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
      };
      const extrudeGeometry = new THREE.ExtrudeGeometry(
        extrudeShape,
        extrudeSetting
      );
      const extrude = new THREE.Mesh(extrudeGeometry, material);
      geometries.push(extrude);
      // add to scene
      const groups = geometries.map((item, index) => {
        const line = new THREE.LineSegments(
          new THREE.EdgesGeometry(item.geometry),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
          })
        );
        const group = new THREE.Group();
        group.add(item, line);
        group.position.set(
          100 *
            Math.cos((index / geometries.length) * Math.PI * 2 + Math.PI / 2),
          0,
          100 *
            Math.sin((index / geometries.length) * Math.PI * 2 + Math.PI / 2)
        );
        return group;
      });
      const group = new THREE.Group();
      group.add(...groups);
      group.position.y = 20;
      groupRef.value = group;
      scene.add(group);
    };
    // initialize stats
    const statsRef = shallowRef(null);
    const initStats = () => {
      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      stats.dom.style.left = "unset";
      stats.dom.style.right = 0;
      statsRef.value = stats;
    };
    // render
    const render = () => {
      const stats = statsRef.value;
      stats.begin();
      const group = groupRef.value;
      group.rotation.y += 0.005;
      const { scene, camera, renderer } = instanceRef.value;
      renderer.render(scene, camera);
      stats.end();
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
        initLights();
        initControls();
        initReferences();
        initGeometries();
        initStats();
        update();
        window.addEventListener("resize", handleResize);
        onInvalidate(() => {
          interuptRef.value = true;
          window.removeEventListener("resize", handleResize);
          const stats = statsRef.value;
          document.body.removeChild(stats.dom);
        });
      });
    });
    return {
      containerRef,
    };
  },
});
</script>