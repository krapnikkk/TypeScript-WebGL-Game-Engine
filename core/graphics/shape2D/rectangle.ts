namespace TSE {
    export class Rectangle implements IShape2D {

        position: Vector2 = Vector2.zero;
        public width: number;
        public height: number;
        public setFromJson(json: any): void {
            if (json.position) {
                this.setFromJson(json.position);
            }
            if (json.width) {
                this.width = +json.width;
            }
            if (json.height) {
                this.height = +json.height;
            }
        }

        public intersects(other: IShape2D): boolean {
            if (other instanceof Rectangle) {
                if (this.pointInShape(other.position) ||
                    this.pointInShape(new Vector2(other.position.x + other.width, other.position.y)) ||
                    this.pointInShape(new Vector2(other.position.x + other.width, other.position.y + other.height)) ||
                    this.pointInShape(new Vector2(other.position.x, other.position.y + other.height))
                ) {
                    return true;
                }
            }
            return false;
        }

        public pointInShape(point: Vector2): boolean {
            if (point.x >= this.position.x && point.x <= this.position.x + this.width) {
                if (point.y >= this.position.y && point.y <= this.position.y + this.height) {
                    return true;
                }
            }
            return false;
        }

    }
}