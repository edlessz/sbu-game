import Camera from "./engine/components/Camera";
import Test from "./engine/components/Test";
import Game from "./engine/Game";
import GameObject from "./engine/GameObject";
import Scene from "./engine/Scene";
import "./style.css";

const viewport = document.querySelector<HTMLCanvasElement>("#viewport");

const game = new Game();

const scene = new Scene();

const camera = new GameObject();
const cameraComponent = camera.addComponent(Camera);
scene.activeCamera = cameraComponent;

const testBox = new GameObject();
testBox.addComponent(Test);

scene.addGameObject(camera);
scene.addGameObject(testBox);
game.setScene(scene);
game.setViewport(viewport);

game.start();

console.log(game);
