import Component from "../Component";
import type { Vector2 } from "../types";

class Camera extends Component {
  public ppu: number = 32;

  public getTransform(): (ctx: CanvasRenderingContext2D) => void {
    if (!this.gameObject)
      throw new Error("Camera must be attached to a GameObject");

    const { ppu, gameObject } = this;
    const { x, y } = gameObject.position;

    return (ctx: CanvasRenderingContext2D) => {
      const viewport = this.game?.getViewport();
      if (!viewport) return;
      const { width, height } = viewport;

      const centerX = x - width / 2 / ppu;
      const centerY = y - height / 2 / ppu;

      ctx.scale(ppu, ppu);
      ctx.translate(-centerX, -centerY);
    };
  }

  public screenToWorld(screenPos: Vector2): Vector2 {
    const viewport = this.game?.getViewport();
    if (!viewport)
      throw new Error("Game must have a viewport to convert screen to world");

    return {
      x:
        (screenPos.x - viewport.width / 2) / this.ppu +
        (this.gameObject?.position.x ?? 0),
      y:
        (screenPos.y - viewport.height / 2) / this.ppu +
        (this.gameObject?.position.y ?? 0),
    };
  }
}

export default Camera;
