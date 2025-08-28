import type Game from "./Game";
import type GameObject from "./GameObject";
import type Scene from "./Scene";

abstract class Component {
  public gameObject: GameObject | null = null;
  public setup?(): void;
  public update?(deltaTime: number): void;
  public render?(g: CanvasRenderingContext2D): void;

  get scene(): Scene | null {
    return this.gameObject?.scene ?? null;
  }
  get game(): Game | null {
    return this.gameObject?.game ?? null;
  }
}

export default Component;
