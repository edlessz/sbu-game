import Component from "../engine/Component";
import BoxCollider from "../engine/components/BoxCollider";
import type Mouse from "../engine/Input/Mouse";
import type { Collider } from "../engine/types";
import ColorBox from "./ColorBox";

class FollowMouse extends Component {
  private mouse: Mouse | null = null;
  private cb: ColorBox | null = null;
  private bc: BoxCollider | null = null;

  public tileMapCollider?: Collider | null = null;

  public setup(): void {
    this.mouse = this.game?.Input.Mouse ?? null;
    this.bc = this.gameObject?.getComponent(BoxCollider) ?? null;
    this.cb = this.gameObject?.getComponent(ColorBox) ?? null;
  }

  public update(_deltaTime: number): void {
    if (!this.mouse || !this.gameObject || !this.game?.activeCamera) return;

    // Follow mouse
    const { x, y } = this.game?.activeCamera?.screenToWorld(
      this.mouse.position
    );
    this.gameObject.position.x = x;
    this.gameObject.position.y = y;

    if (this.cb && this.bc && this.tileMapCollider) {
      const colliding = this.bc.intersects(this.tileMapCollider);
      this.cb.color = colliding ? "#00f" : "#0f0";
    }
  }
}

export default FollowMouse;
