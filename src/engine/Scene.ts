import type Camera from "./components/Camera";
import type Game from "./Game";
import type GameObject from "./GameObject";

class Scene {
  public game: Game | null = null;
  private gameObjects: GameObject[] = [];

  public activeCamera: Camera | null = null;

  public setup(): void {
    for (const obj of this.gameObjects) obj.setup();
  }
  public update(deltaTime: number): void {
    for (const obj of this.gameObjects) obj.update(deltaTime);
  }
  public render(g: CanvasRenderingContext2D): void {
    const sortedGameObjects = this.gameObjects.sort(
      (a, b) => b.position.z - a.position.z
    );
    for (const obj of sortedGameObjects) obj.render(g);
  }

  public addGameObject(...gameObjects: GameObject[]): void {
    this.gameObjects.push(...gameObjects);
    for (const gameObject of gameObjects) gameObject.scene = this;
  }
  public removeGameObject(gameObject: GameObject): void {
    this.gameObjects = this.gameObjects.filter((obj) => obj !== gameObject);
    gameObject.scene = null;
  }
}

export default Scene;
