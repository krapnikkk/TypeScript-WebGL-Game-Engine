namespace TSE {
    export class Vector3 {
        private _x: number;
        private _y: number;
        private _z: number;

        public constructor(x: number = 0, y: number = 0, z: number = 0) {
            this._x = x;
            this._y = y;
            this._z = z;
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
        public get z(): number {
            return this._z;
        }

        public set z(value: number) {
            this._z = value;
        }

        public equals(v: Vector3): boolean {
            return this.x == v.x && this.y == v.y && this.z == v.z;
        }

        public toArray(): number[] {
            return [this._x, this._y, this._z];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        public static get zero(): Vector3 {
            return new Vector3();
        }

        public static get one(): Vector3 {
            return new Vector3(1, 1, 1);
        }

        public set(x?: number, y?: number, z?: number): void {
            if (x) {
                this._x = x;
            }
            if (y) {
                this._y = y;
            }
            if (z) {
                this._z = z;
            }
        }

        public copyFrom(vector3: Vector3): void {
            this._x = vector3.x;
            this._y = vector3.y;
            this._z = vector3.z;
        }

        public setFromJson(json: any): void {
            let { x, y, z } = json;
            this._x = +x || 0;
            this._y = +y || 0;
            this._z = +z || 0;
        }

        public add(v: Vector3): Vector3 {
            let { x, y, z } = v;
            this.x += x;
            this.y += y;
            this.z += z;
            return this;
        }

        public subtract(v: Vector3): Vector3 {
            this._x -= v._x;
            this._y -= v._y;
            this._z -= v._z;

            return this;
        }

        public multiply(v: Vector3): Vector3 {
            this._x *= v._x;
            this._y *= v._y;
            this._z *= v._z;

            return this;
        }

        public divide(v: Vector3): Vector3 {
            this._x /= v._x;
            this._y /= v._y;
            this._z /= v._z;

            return this;
        }

    }
}