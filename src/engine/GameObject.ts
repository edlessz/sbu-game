import type Component from "./Component";
import type Game from "./Game";
import type Scene from "./Scene";
import type { Vector3, Vector2 } from "./types";

class GameObject {
  public position: Vector3 = { x: 0, y: 0, z: 0 };
  public scale: Vector2 = { x: 1, y: 1 };

  public scene: Scene | null = null;
  get game(): Game | null {
    return this.scene?.game ?? null;
  }

  private components: Component[] = [];
  public addComponent<T extends Component>(ComponentType: new () => T): T {
    const component = new ComponentType();
    component.gameObject = this;
    this.components.push(component);
    return component;
  }
  public getComponent<T extends Component>(
    ComponentType: new () => T
  ): T | null {
    return (
      (this.components.find((c) => c instanceof ComponentType) as T) ?? null
    );
  }

  public update(deltaTime: number): void {
    for (const component of this.components) component.update?.(deltaTime);
  }
  public render(g: CanvasRenderingContext2D): void {
    for (const component of this.components) component.render?.(g);
  }
}

export default GameObject;
