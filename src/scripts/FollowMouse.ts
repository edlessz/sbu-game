import Component from "../engine/Component";
import type Mouse from "../engine/Input/Mouse";

class FollowMouse extends Component {
  private mouse: Mouse | null = null;

  public setup(): void {
    this.mouse = this.game?.Input.Mouse ?? null;
  }

  public update(deltaTime: number): void {
    if (!this.mouse || !this.gameObject || !this.game?.activeCamera) return;

    const { x, y } = this.game?.activeCamera?.screenToWorld(
      this.mouse.position
    );
    this.gameObject.position.x = x;
    this.gameObject.position.y = y;

    void deltaTime;
  }
}

export default FollowMouse;
