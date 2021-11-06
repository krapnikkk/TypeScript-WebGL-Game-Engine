module TSE {
    export class Engine {
        private _canvas: HTMLCanvasElement;
        private _basicShader: Shader;
        private _projection: Martix4;
        private _sprite: Sprite;
        public constructor() {

        }

        public start(): void {
            this._canvas = GLUtilities.initialize();
            AssetManager.initialize();
            gl.clearColor(0, 0, 0, 1);
            this._basicShader = new BasicShader();
            this._basicShader.use();


            

            // load  material
            MaterialManager.registerMaterial(new Material("create", "./assets/texture/sky.jpeg", new Color(255, 128, 0, 255)))

            let zoneID = ZoneManager.createTestZone();
            ZoneManager.changeZone(zoneID);

            this._projection = Martix4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);



            this.resize();
            this.loop();
        }

        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._projection = Martix4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }
        }

        private loop(): void {
            MessageBus.update(0);
            ZoneManager.update(0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            ZoneManager.render(this._basicShader);

            let projectionPosition = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}