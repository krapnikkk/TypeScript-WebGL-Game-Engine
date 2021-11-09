namespace TSE {
    export class Sprite {
        private _name: string;
        private _width: number;
        private _height: number;

        private _buffer: GLBuffer;
        private _materialName: string;
        private _material: Material;

        public position: Vector3 = new Vector3();


        public constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
            this._name = name;
            this._width = width;
            this._height = height;
            this._materialName = materialName;
            this._material = MaterialManager.getMaterial(materialName);
        }

        public get name(): string {
            return this._name;
        }

        public load(): void {
            this._buffer = new GLBuffer(5);
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);

            let textCoordAttribute = new AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.offset = 3;
            textCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(textCoordAttribute);

            let vertices = [
                // x y z u v
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }

        public update(time: number): void {

        }

        public draw(shader: Shader,model:Martix4): void {
            let colorLocation = shader.getUniformLocation("u_tint");
            gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());

            let modelLocation = shader.getUniformLocation("u_model");
            
            // gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Martix4.translation(this.position).data));
            gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());
            if(this._material.diffuseTexture){
                this._material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this._buffer.bind();
            this._buffer.draw();
        }

        public destory(): void {
            this._buffer.destroy();
            MaterialManager.releaseMaterial(this._materialName);
            this._material = null;
        }
    }
}