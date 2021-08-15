module TSE {
    export class Martix4 {
        private _data: number[] = [];

        private constructor() {
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }

        public get data(): number[] {
            return this._data;
        }

        public static identity(): Martix4 {
            return new Martix4();
        }

        public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farCLip: number): Martix4 {
            let m = new Martix4();
            let lr: number = 1.0 / (left - right);
            let bt: number = 1.0 / (bottom - top);
            let nf: number = 1.0 / (nearClip - farCLip);
            m._data[0] = -2.0 * lr;

            m._data[5] = -2.0 * bt;

            m._data[10] = 2.0 * nf;

            m._data[12] = (left + right) * lr;
            m._data[13] = (top + bottom) * bt;
            m._data[14] = (farCLip + nearClip) * nf

            return m;
        }

        public static tranlstion(position: Vector3): Martix4 {
            let m = new Martix4();
            m._data[12] = position.x;
            m._data[13] = position.y;
            m._data[14] = position.z;

            return m;
        }
    }
}