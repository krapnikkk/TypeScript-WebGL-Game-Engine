namespace TSE {
    export class Sprite {
        protected _name: string;
        protected _width: number;
        protected _height: number;

        protected _buffer: GLBuffer;
        protected _materialName: string;
        protected _material: Material;
        protected _vertices: Vertex[] = [];
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
            this._buffer = new GLBuffer();
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);

            let textCoordAttribute = new AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(textCoordAttribute);

            this._vertices = [ // a face
                // x y z u v
                new Vertex(0, 0, 0, 0, 0),
                new Vertex(0, this._height, 0, 0, 1.0),
                new Vertex(this._width, this._height, 0, 1.0, 1.0),
                new Vertex(this._width, this._height, 0, 1.0, 1.0),
                new Vertex(this._width, 0, 0, 1.0, 0),
                new Vertex(0, 0, 0, 0, 0)
            ];
            for(let v of this._vertices){
                this._buffer.pushBackData(v.toArray());
            }
            this._buffer.upload();
            this._buffer.unbind();
        }

        public update(time: number): void {
        }

        public draw(shader: Shader, model: Martix4): void {
            let colorLocation = shader.getUniformLocation("u_tint");
            gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());

            let modelLocation = shader.getUniformLocation("u_model");

            gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());
            if (this._material.diffuseTexture) {
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