module TSE {
    export class Engine {
        private _canvas: HTMLCanvasElement;
        private _shader: Shader;
        private _projection: Martix4;
        private _sprite: Sprite;
        public constructor() {

        }

        public start(): void {
            this._canvas = GLUtilities.initialize();

            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.use();

            this._projection = Martix4.orthographic(0, this._canvas.width, 0, this._canvas.height, -1.0, 100.0);
            this._sprite = new Sprite("test");
            this._sprite.load();
            this._sprite.position.x = 200;

            this.resize();
            this.loop();
        }

        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                // gl.viewport(0, 0, this._canvas.width, this._canvas.height);
                gl.viewport(-1, 1, 1, -1);
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            let colorPosition = this._shader.getUniformLocation("u_color");
            gl.uniform4fv(colorPosition, new Float32Array([1, 0.5, 0, 1]));

            let projectionPosition = this._shader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            let modelPosition = this._shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelPosition, false, new Float32Array(Martix4.tranlstion(this._sprite.position).data));

            this._sprite.draw();

            requestAnimationFrame(this.loop.bind(this));
        }

        private loadShaders(): void {
            let vertexShaderSource = `
                attribute vec3 a_position;
                uniform mat4 u_projection;
                uniform mat4 u_model;
                void main(){
                    gl_Position = u_projection * u_model * vec4(a_position,1.0);
                }
             `;
            let fragmentShaderSource = `
                precision mediump float;
                uniform vec4 u_color;
                void main(){
                    gl_FragColor = u_color;
                }
             `;
            this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}