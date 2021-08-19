module TSE {
    export class Transform {
        public position: Vector3 = Vector3.zero;
        public rotation: Vector3 = Vector3.zero;
        public scale: Vector3 = Vector3.one;

        public copyFrom(transform: Transform): void {
            this.position.copyFrom(transform.position);
            this.rotation.copyFrom(transform.rotation);
            this.scale.copyFrom(transform.scale);
        }

        public getTransformationMatrix(): Martix4 {
            let tranlstion = Martix4.tranlstion(this.position);

            // todo add x & y for 3d.
            let rotation = Martix4.rotationZ(this.rotation.z);
            let scale = Martix4.scale(this.scale);

            // T * R * S
            return Martix4.multiply(Martix4.multiply(tranlstion, rotation), scale);
        }
    }
}