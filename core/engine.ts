module TSE {
    export class Engine {
        private _canvas: HTMLCanvasElement;
        private _shader: Shader;
        public constructor() {

        }

        public start(): void {
            this._canvas = GLUtilities.initialize();
            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.use();

            this.loop();
        }

        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
        }

        private loadShaders(): void {
            let vertexShaderSource = `
                attribute vec3 a_position;
                void main(){
                    gl_Position = vec4(a_position,1.0);
                }
             `;
             let fragmentShaderSource = `
                precision mediump float;
                void main(){
                    gl_FragColor = vec4(1.0);
                }
             `;
             this._shader = new Shader("basic",vertexShaderSource,fragmentShaderSource);
        }
    }
}