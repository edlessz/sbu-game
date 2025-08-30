import Component from "../Component";
import type { Collider, Rectangle, Vector2 } from "../types";
import { AABB } from "../utils";

class BoxCollider extends Component implements Collider {
  public position: Vector2 = { x: 0, y: 0 };
  public width: number = 1;
  public height: number = 1;

  public renderDebug = false;

  public getColliders(): Rectangle[] {
    if (!this.gameObject) return [];
    return [
      {
        x: this.gameObject.position.x + this.position.x - this.width / 2,
        y: this.gameObject.position.y + this.position.y - this.height / 2,
        width: this.gameObject.scale.x * this.width,
        height: this.gameObject.scale.y * this.height,
      },
    ];
  }
  public intersects(other: Collider): boolean {
    const rectangle = this.getColliders()[0];
    if (!rectangle) return false;
    return other.getColliders().some((r) => AABB(r, rectangle));
  }
  public render(g: CanvasRenderingContext2D): void {
    if (!this.renderDebug || !this.gameObject) return;

    g.save();
    g.strokeStyle = "green";
    g.lineWidth = 2 / (this.game?.activeCamera?.ppu || 2);
    g.strokeRect(
      this.gameObject.position.x +
        this.position.x -
        (this.width * this.gameObject.scale.x) / 2,
      this.gameObject.position.y +
        this.position.y -
        (this.height * this.gameObject.scale.y) / 2,
      this.width * this.gameObject.scale.x,
      this.height * this.gameObject.scale.y
    );
    g.restore();
  }
}

export default BoxCollider;
