import Component from "../Component";

class Camera extends Component {
  public ppu: number = 32;

  getTransform(): (ctx: CanvasRenderingContext2D) => void {
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
}

export default Camera;
