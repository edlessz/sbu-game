import Camera from "./Camera";

class Test extends Camera {
  public render(g: CanvasRenderingContext2D): void {
    if (!this.gameObject) return;
    const { x, y } = this.gameObject.position;
    g.fillStyle = "red";
    g.fillRect(x - 0.5, y - 0.5, 1, 1);
  }
}

export default Test;
