import * as THREE from 'three';

export const createGroup = (...geometries) => {
  const group = new THREE.Group();
  if (geometries.length) {
    group.add(...geometries);
  }
  return group;
};