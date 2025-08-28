import type { Vector2 } from "../types";

class Mouse {
  private viewportRef: HTMLCanvasElement | null = null;

  public position: Vector2 = { x: 0, y: 0 };

  private onMouseMove = (event: MouseEvent) => {
    this.position.x = event.clientX;
    this.position.y = event.clientY;
  };
  private onMouseMoveEvent = this.onMouseMove.bind(this);

  public initialize(viewportRef: HTMLCanvasElement): void {
    this.viewportRef = viewportRef;
    this.viewportRef.addEventListener("mousemove", this.onMouseMoveEvent);
  }
  public destroy(): void {
    if (!this.viewportRef) return;

    this.viewportRef.removeEventListener("mousemove", this.onMouseMoveEvent);
    this.viewportRef = null;
  }
}

export default Mouse;
