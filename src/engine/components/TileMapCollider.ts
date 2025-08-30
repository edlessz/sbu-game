import Component from "../Component";
import type { Collider, Rectangle, Vector2 } from "../types";

class TileMapCollider extends Component implements Collider {
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

  // Collisions
  public generateRectangles(): void {
    const rectangles: Rectangle[] = [];
    const spansByRow: Map<number, { x: number; width: number }[]> = new Map();

    // Pass 1: find horizontal spans per row
    const allAddresses = Object.keys(this.solids).map((addr) =>
      this.decodeAddress(addr)
    );
    const ys = [...new Set(allAddresses.map((p) => p.y))].sort((a, b) => a - b);

    for (const y of ys) {
      const xs = allAddresses
        .filter((p) => p.y === y)
        .map((p) => p.x)
        .sort((a, b) => a - b);

      const spans: { x: number; width: number }[] = [];
      let spanStart: number | null = null;
      let prevX: number | null = null;

      for (const x of xs) {
        if (spanStart === null) {
          spanStart = x;
          prevX = x;
          continue;
        }

        if (prevX !== null && x === prevX + 1) {
          // continue span
          prevX = x;
        } else {
          // close span
          spans.push({ x: spanStart, width: prevX! - spanStart + 1 });
          spanStart = x;
          prevX = x;
        }
      }
      if (spanStart !== null && prevX !== null)
        spans.push({ x: spanStart, width: prevX - spanStart + 1 });

      spansByRow.set(y, spans);
    }

    // Pass 2: merge vertically
    const visited = new Set<string>();
    for (const [y, spans] of spansByRow.entries()) {
      for (const span of spans) {
        const key = `${span.x},${y},${span.width}`;
        if (visited.has(key)) continue;

        let height = 1;
        let nextY = y + 1;

        while (true) {
          const nextSpans = spansByRow.get(nextY);
          if (!nextSpans) break;

          const match = nextSpans.find(
            (s) => s.x === span.x && s.width === span.width
          );
          if (!match) break;

          visited.add(`${match.x},${nextY},${match.width}`);
          height++;
          nextY++;
        }

        rectangles.push({ x: span.x, y, width: span.width, height });
      }
    }

    this.solidRectangles = rectangles;
  }
  public getColliders(): Rectangle[] {
    return this.solidRectangles;
  }
  public intersects(other: Collider): boolean {
    const AABB = (o: Rectangle): boolean => {
      for (const rect of this.solidRectangles) {
        const gameObjectPosition = this.gameObject?.position ?? { x: 0, y: 0 };
        const rectX = rect.x + gameObjectPosition.x;
        const rectY = rect.y + gameObjectPosition.y;

        if (
          o.x < rectX + o.width &&
          o.x + o.width > rectX &&
          o.y < rectY + o.height &&
          o.y + o.height > rectY
        )
          return true; // Collision detected
      }
      return false; // No collision
    };
    return other.getColliders().some((rect) => AABB(rect));
  }

  // Debug rendering
  public renderDebug = false;
  public render(g: CanvasRenderingContext2D): void {
    if (!this.renderDebug) return;

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
}

export default TileMapCollider;
