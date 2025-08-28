import Component from "../Component";
import type { Vector2 } from "../types";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

class TileMapCollider extends Component {
  private solids: Record<string, boolean> = {};
  private solidRectangles: Rectangle[] = [];

  private encodeAddress(x: number, y: number): string {
    return `${x},${y}`;
  }
  private decodeAddress(address: string): Vector2 {
    const [x, y] = address.split(",").map(Number);
    return { x, y };
  }
  public loadData(data: Map<number[], boolean>): void {
    this.solids = Object.fromEntries(
      Array.from(data.entries())
        .filter(([pos, _]) => pos.length === 2)
        .map(([pos, solid]) => [this.encodeAddress(pos[0], pos[1]), solid])
    );
    this.generateRectangles();
  }
  public generateRectangles(): void {
    const rectangles: Rectangle[] = [];
    const visited: Record<string, boolean> = {};

    const isSolid = (x: number, y: number): boolean =>
      this.solids[this.encodeAddress(x, y)] ?? false;
    const markVisited = (x: number, y: number): void => {
      visited[this.encodeAddress(x, y)] = true;
    };
    const isVisited = (x: number, y: number): boolean =>
      visited[this.encodeAddress(x, y)] ?? false;

    Object.keys(this.solids).forEach((address) => {
      const { x: startX, y: startY } = this.decodeAddress(address);
      if (!isSolid(startX, startY) || isVisited(startX, startY)) return;

      let width = 1;
      let height = 1;

      // Expand width
      while (
        isSolid(startX + width, startY) &&
        !isVisited(startX + width, startY)
      ) {
        width++;
      }

      // Expand height
      let canExpandHeight = true;
      while (canExpandHeight) {
        for (let x = 0; x < width; x++) {
          if (
            !isSolid(startX + x, startY + height) ||
            isVisited(startX + x, startY + height)
          ) {
            canExpandHeight = false;
            break;
          }
        }
        if (canExpandHeight) height++;
      }

      // Mark all tiles in the rectangle as visited
      for (let x = 0; x < width; x++)
        for (let y = 0; y < height; y++) markVisited(startX + x, startY + y);

      rectangles.push({ x: startX, y: startY, width, height });
    });

    this.solidRectangles = rectangles;
  }

  public debugRender = false;
  public render(g: CanvasRenderingContext2D): void {
    if (!this.debugRender) return;

    // Draw individual tiles
    g.strokeStyle = "#0f0";
    g.lineWidth = 2 / (this.game?.activeCamera?.ppu ?? 2);
    Object.entries(this.solids).forEach(([address, solid]) => {
      if (!solid) return;

      const gameObjectPosition = this.gameObject?.position ?? { x: 0, y: 0 };
      const { x: localX, y: localY } = this.decodeAddress(address);
      const x = localX + gameObjectPosition.x;
      const y = localY + gameObjectPosition.y;
      g.strokeRect(x, y, 1, 1);
    });

    // Draw optimized rectangles
    g.strokeStyle = "#f00";
    g.lineWidth = 2 / (this.game?.activeCamera?.ppu ?? 2);
    for (const rect of this.solidRectangles) {
      const gameObjectPosition = this.gameObject?.position ?? { x: 0, y: 0 };
      const x = rect.x + gameObjectPosition.x;
      const y = rect.y + gameObjectPosition.y;
      g.strokeRect(x, y, rect.width, rect.height);
    }
  }

  public AABB(other: Rectangle): boolean {
    for (const rect of this.solidRectangles) {
      const gameObjectPosition = this.gameObject?.position ?? { x: 0, y: 0 };
      const rectX = rect.x + gameObjectPosition.x;
      const rectY = rect.y + gameObjectPosition.y;

      if (
        other.x < rectX + rect.width &&
        other.x + other.width > rectX &&
        other.y < rectY + rect.height &&
        other.y + other.height > rectY
      )
        return true; // Collision detected
    }
    return false; // No collision
  }
}

export default TileMapCollider;
