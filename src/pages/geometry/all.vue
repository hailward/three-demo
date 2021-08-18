<template>
  <layout>
    <section class="container">
      <main class="main" ref="containerRef" />
    </section>
  </layout>
</template>

<script lang="ts">
import { ref, shallowRef, onMounted, watchEffect, defineComponent } from "vue";
import * as THREE from "three";
import FontJSON from "three/examples/fonts/helvetiker_regular.typeface.json";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
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
      camera.position.set(0, 50, 200);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setClearColor(0x222842, 1);
      container.appendChild(renderer.domElement);
      instanceRef.value = { scene, camera, renderer };
      interuptRef.value = false;
      window.scene = scene;
      window.camera = camera;
      window.renderer = renderer;
    };
    const initLights = () => {
      const { scene } = instanceRef.value;
      const lights = [new THREE.DirectionalLight(0xffffff, 1)];
      lights[0].position.set(0, 100, 500);
      scene.add(...lights);
    };
    // initialize controls
    const initControls = () => {
      const { camera, renderer } = instanceRef.value;
      const controls = new OrbitControls(camera, renderer.domElement);
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
        RIGHT: THREE.MOUSE.PAN,
      };
      // 监听触摸
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
    };
    // initialize renferences
    const initReferences = () => {
      const { scene } = instanceRef.value;
      const gridWidth = 400;
      const grid = new THREE.GridHelper(gridWidth, 80);
      scene.add(grid);
      const axes = new THREE.AxesHelper(gridWidth / 2);
      scene.add(axes);
    };
    const initGeometries = () => {
      const { scene } = instanceRef.value;
      const meshPhongMaterial = new THREE.MeshPhongMaterial({
        color: 0xccac00,
        side: THREE.DoubleSide,
      });
      const lineBasicMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
      });
      const geometries = [];
      // plane: 平面几何体
      const planeGroup = new THREE.Group();
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      planeGroup.add(new THREE.Mesh(planeGeometry, meshPhongMaterial));
      planeGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(planeGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(planeGroup);
      // tetrahedron: 四面体
      const tetrahedronGroup = new THREE.Group();
      const tetrahedronGeometry = new THREE.TetrahedronGeometry(5, 0);
      tetrahedronGroup.add(
        new THREE.Mesh(tetrahedronGeometry, meshPhongMaterial)
      );
      tetrahedronGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(tetrahedronGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(tetrahedronGroup);
      // box: 立方体
      const boxGroup = new THREE.Group();
      const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      boxGroup.add(new THREE.Mesh(boxGeometry, meshPhongMaterial));
      boxGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(boxGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(boxGroup);
      // octahedron: 八面集合体
      const octahedronGroup = new THREE.Group();
      const octahedronGeometry = new THREE.OctahedronGeometry(5, 0);
      octahedronGroup.add(
        new THREE.Mesh(octahedronGeometry, meshPhongMaterial)
      );
      octahedronGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(octahedronGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(octahedronGroup);
      // dodecahedron: 十二面体
      const dodecahedronGroup = new THREE.Group();
      const dodecahedronGeometry = new THREE.DodecahedronGeometry(5, 0);
      dodecahedronGroup.add(
        new THREE.Mesh(dodecahedronGeometry, meshPhongMaterial)
      );
      dodecahedronGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(dodecahedronGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(dodecahedronGroup);
      // icosahedron: 二十面体
      const icosahedronGroup = new THREE.Group();
      const icosahedronGeometry = new THREE.IcosahedronGeometry(5, 0);
      icosahedronGroup.add(
        new THREE.Mesh(icosahedronGeometry, meshPhongMaterial)
      );
      icosahedronGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(icosahedronGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(icosahedronGroup);
      // sphere: 球几何体
      const sphereGroup = new THREE.Group();
      const sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
      sphereGroup.add(new THREE.Mesh(sphereGeometry, meshPhongMaterial));
      sphereGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(sphereGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(sphereGroup);
      // ring: 圆环几何体
      const ringGroup = new THREE.Group();
      const ringGeometry = new THREE.RingGeometry(2, 5, 6);
      ringGroup.add(new THREE.Mesh(ringGeometry, meshPhongMaterial));
      ringGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(ringGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(ringGroup);
      // circle: 圆形
      const circleGroup = new THREE.Group();
      const circleGeometry = new THREE.CircleGeometry(5, 18);
      circleGroup.add(new THREE.Mesh(circleGeometry, meshPhongMaterial));
      circleGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(circleGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(circleGroup);
      // 圆锥
      const coneGroup = new THREE.Group();
      const coneGeometry = new THREE.ConeGeometry(5, 10, 18);
      coneGroup.add(new THREE.Mesh(coneGeometry, meshPhongMaterial));
      coneGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(coneGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(coneGroup);
      // cylinder: 圆柱
      const cylinderGroup = new THREE.Group();
      const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 18);
      cylinderGroup.add(new THREE.Mesh(cylinderGeometry, meshPhongMaterial));
      cylinderGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(cylinderGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(cylinderGroup);
      // torus: 圆环
      const torusGroup = new THREE.Group();
      const torusGeometry = new THREE.TorusGeometry(5, 1, 6, 18);
      torusGroup.add(new THREE.Mesh(torusGeometry, meshPhongMaterial));
      torusGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(torusGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(torusGroup);
      // torusKnot: 圆环扭结几何体
      const torusKnotGroup = new THREE.Group();
      const torusKnotGeometry = new THREE.TorusKnotGeometry(5, 1, 50, 6);
      torusKnotGroup.add(new THREE.Mesh(torusKnotGeometry, meshPhongMaterial));
      torusKnotGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(torusKnotGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(torusKnotGroup);
      // tube: 管道几何体
      const tubeGroup = new THREE.Group();
      function CustomSinCurve(scale) {
        const curve = new THREE.Curve();
        Object.assign(this, curve);
        this.scale = scale === undefined ? 1 : scale;
      }
      CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
      CustomSinCurve.prototype.constructor = CustomSinCurve;
      CustomSinCurve.prototype.getPoint = function (t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      };
      const tubeGeometry = new THREE.TubeGeometry(new CustomSinCurve(5), 20, 1, 6, false);
      tubeGroup.add(new THREE.Mesh(tubeGeometry, meshPhongMaterial));
      tubeGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(tubeGeometry), lineBasicMaterial));
      geometries.push(tubeGroup);
      // text: 文本几何体
      const textGroup = new THREE.Group();
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
      textGroup.add(new THREE.Mesh(textGeometry, meshPhongMaterial));
      textGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(textGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(textGroup);
      // shape: 形状几何体
      const shapeGroup = new THREE.Group();
      const x = 0,
        y = 0;
      const heartShape = new THREE.Shape();
      heartShape.moveTo(x, y + 5);
      heartShape.bezierCurveTo(x, y + 5, x - 1, y, x - 5, y);
      heartShape.bezierCurveTo(x - 11, y, x - 11, y + 7, x - 11, y + 7);
      heartShape.bezierCurveTo(x - 11, y + 11, x - 8, y + 15.4, x, y + 19);
      heartShape.bezierCurveTo(x + 7, y + 15.4, x + 11, y + 11, x + 11, y + 7);
      heartShape.bezierCurveTo(x + 11, y + 7, x + 11, y, x + 5, y);
      heartShape.bezierCurveTo(x + 2, y, x, y + 5, x, y + 5);
      const shapeGeometry = new THREE.ShapeGeometry(heartShape);
      shapeGroup.add(new THREE.Mesh(shapeGeometry, meshPhongMaterial));
      shapeGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(shapeGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(shapeGroup);
      // lathe: 车削集合体
      const latheGroup = new THREE.Group();
      const lathePoints = [];
      for (let i = 0; i <= Math.PI * 4; i += Math.PI / 6) {
        lathePoints.push(new THREE.Vector2(i, Math.cos(i)));
      }
      const latheGeometry = new THREE.LatheGeometry(lathePoints);
      latheGroup.add(new THREE.Mesh(latheGeometry, meshPhongMaterial));
      latheGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(latheGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(latheGroup);
      // extrude: 挤压几何体
      const extrudeGroup = new THREE.Group();
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
      extrudeGroup.add(new THREE.Mesh(extrudeGeometry, meshPhongMaterial));
      extrudeGroup.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(extrudeGeometry),
          lineBasicMaterial
        )
      );
      geometries.push(extrudeGroup);
      // set position
      planeGroup.position.set(0, 0, 0);
      tetrahedronGroup.position.set(0, 0, -50);
      boxGroup.position.set(0, 0, -100);
      octahedronGroup.position.set(0, 0, -150);
      dodecahedronGroup.position.set(0, 0, -200);
      icosahedronGroup.position.set(0, 0, -250);
      sphereGroup.position.set(0, 0, -300);
      /* --- */
      textGroup.position.set(-50 - 10, 0, 0);
      shapeGroup.position.set(-50, 0, -50);
      latheGroup.position.set(-50, 0, -100);
      extrudeGroup.position.set(-50, 0, -150 + 5);
      /* --- */
      ringGroup.position.set(50, 0, 0);
      circleGroup.position.set(50, 0, -50);
      coneGroup.position.set(50, 0, -100);
      cylinderGroup.position.set(50, 0, -150);
      torusGroup.position.set(50, 0, -200);
      torusKnotGroup.position.set(50, 0, -250);
      tubeGroup.position.set(50, 0, -300);
      /* --- */
      const group = new THREE.Group();
      group.add(...geometries);
      group.position.set(0, 0, 150);
      // add to scene
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