namespace TSE {
    export class Circle implements IShape2D {
        position: Vector2 = Vector2.zero;
        public radius: number;
        public setFromJson(json: any): void {
            if (json.position) {
                this.setFromJson(json.position);
            }
        }
        public intersects(other: IShape2D): boolean {
            if (other instanceof Circle) {
                let distance = Math.abs(Vector2.distance(other.position, this.position));
                let radiusLengths = this.radius + other.radius;
                if (distance <= radiusLengths) {
                    return true;
                }
            }
            return false;
        }

        public pointInShape(point: Vector2): boolean {
            let absDistance = Math.abs(Vector2.distance(this.position, point));
            if (absDistance < this.radius) {
                return true;
            }
            return false;
        }
    }
}