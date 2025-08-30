import BoxCollider from "./engine/components/BoxCollider";
import Camera from "./engine/components/Camera";
import TileMapCollider from "./engine/components/TileMapCollider";
import Game from "./engine/Game";
import GameObject from "./engine/GameObject";
import Scene from "./engine/Scene";
import ColorBox from "./scripts/ColorBox";
import FollowMouse from "./scripts/FollowMouse";
import "./style.css";

const viewport = document.querySelector<HTMLCanvasElement>("#viewport");

const game = new Game();
const scene = new Scene();

const camera = new GameObject();
const cameraComponent = camera.addComponent(Camera);
scene.activeCamera = cameraComponent;
scene.addGameObject(camera);

const red = new GameObject();
red.addComponent(ColorBox);
scene.addGameObject(red);

const tileMap = new GameObject();
const tileMapCollider = tileMap.addComponent(TileMapCollider);
tileMapCollider.renderDebug = true;
tileMapCollider.loadData(
  new Map([
    [[0, 2], true],
    [[1, 2], true],
    [[2, 2], true],

    [[0, 4], true],
    [[0, 5], true],
    [[0, 6], true],
    [[1, 6], true],
    [[2, 6], true],
    [[3, 6], true],
    [[4, 6], true],
    [[5, 6], true],

    [[4, 4], true],
    [[4, 5], true],
    [[4, 6], true],
    [[4, 7], true],
    [[4, 8], true],

    [[1, 8], true],
    [[2, 8], true],
    [[3, 8], true],
    [[4, 8], true],
    [[5, 8], true],
    [[6, 8], true],

    [[6, 1], true],
    [[6, 2], true],
    [[6, 3], true],
    [[6, 4], true],

    [[1, 0], true],
    [[1, 1], true],
    [[1, 3], true],
    [[1, 4], true],
  ])
);
scene.addGameObject(tileMap);

const mouseBox = new GameObject();
mouseBox.addComponent(ColorBox);
const mouseBoxCollider = mouseBox.addComponent(BoxCollider);
mouseBoxCollider.renderDebug = true;
mouseBoxCollider.position.x = 1;
mouseBoxCollider.width = 2.5;
mouseBoxCollider.height = 0.5;
mouseBox.addComponent(FollowMouse).tileMapCollider = tileMapCollider;
scene.addGameObject(mouseBox);

game.setScene(scene);
game.setViewport(viewport);
game.start();
