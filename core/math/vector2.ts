namespace TSE {
    export class Vector2 {
        private _x: number;
        private _y: number;

        public constructor(x: number = 0, y: number = 0) {
            this._x = x;
            this._y = y;
        }

        public get x(): number {
            return this._x;
        }

        public set x(value: number) {
            this._x = value;
        }
        public get y(): number {
            return this._y;
        }

        public set y(value: number) {
            this._y = value;
        }

        public static get zero(): Vector2 {
            return new Vector2();
        }

        public static get one(): Vector2 {
            return new Vector2(1, 1);
        }

        public copyFrom(vector2: Vector2): void {
            this._x = vector2.x;
            this._y = vector2.y;
        }

        public toArray(): number[] {
            return [this._x, this._y];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        public set(x?: number, y?: number): void {
            if (x) {
                this._x = x;
            }
            if (y) {
                this._y = y;
            }
        }

        public add(v: Vector2): Vector2 {
            let { x, y } = v;
            this.x += x;
            this.y += y;
            return this;
        }

        public subtract(v: Vector2): Vector2 {
            this._x -= v._x;
            this._y -= v._y;
            return this;
        }

        public multiply(v: Vector2): Vector2 {
            this._x *= v._x;
            this._y *= v._y;
            return this;
        }

        public divide(v: Vector2): Vector2 {
            this._x /= v._x;
            this._y /= v._y;
            return this;
        }

        public static distance(a: Vector2, b: Vector2): number {
            let diff = a.subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        }

    }
}