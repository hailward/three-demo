import { createRouter, createWebHashHistory } from 'vue-router';
import { Home, CameraWithGUI, Geometries } from '../pages';

const routes = [
  { path: '/', component: Home },
  { path: '/camera-with-gui', component: CameraWithGUI },
  { path: '/geometries', component: Geometries },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
