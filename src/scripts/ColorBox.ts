import Component from "../engine/Component";

class ColorBox extends Component {
  public color: string = "red";

  public render(g: CanvasRenderingContext2D): void {
    if (!this.gameObject) return;
    const { x, y } = this.gameObject.position;
    g.fillStyle = this.color;
    g.fillRect(
      x - this.gameObject.scale.x / 2,
      y - this.gameObject.scale.y / 2,
      this.gameObject.scale.x,
      this.gameObject.scale.y
    );
  }
}

export default ColorBox;
