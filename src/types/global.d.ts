import { Camera, Scene, Renderer } from "three";

interface LooseObject {
  [key: string]: any
}

declare global {
  interface Window extends LooseObject {
    scene?: Scene
    camera?: Camera
    renderer?: Renderer
  }
}