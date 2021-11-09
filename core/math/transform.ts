namespace TSE {
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
            let translation = Martix4.translation(this.position);

            // todo add x & y for 3d.
            // let rotation = Martix4.rotationZ(this.rotation.z);
            let rotation = Martix4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
            let scale = Martix4.scale(this.scale);

            // T * R * S
            return Martix4.multiply(Martix4.multiply(translation, rotation), scale);
        }

        public setFromJson(json: any): void {
            let { position, scale, rotation } = json;
            if (position !== undefined) {
                this.position.setFromJson(position);
            }
            if (scale !== undefined) {
                this.scale.setFromJson(scale);
            }
            if (rotation !== undefined) {
                this.rotation.setFromJson(rotation);
            }
        }
    }
}