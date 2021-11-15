namespace TSE {
    export class Engine implements IMessageHandler{
        private _canvas: HTMLCanvasElement;
        private _basicShader: Shader;
        private _projection: Martix4;
        private _previousTime: number = 0;
        public constructor() {

        }
        onMessage(message: Message): void {
            if(message.code == "MOUSE_UP"){
                let context = message.context as MouseContent;
                console.log(context.position);
            }
        }

        public start(): void {
            this._canvas = GLUtilities.initialize();
            AssetManager.initialize();
            InputManager.initialize();
            ZoneManager.initialize();

            Message.subscribe("MOUSE_UP",this);

            gl.clearColor(0, 0, 0, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // load  material
            MaterialManager.registerMaterial(new Material("sky", "./assets/texture/sky.jpeg", Color.white()))
            MaterialManager.registerMaterial(new Material("duck", "./assets/texture/duck.png", Color.white()))

            // todo id from config
            ZoneManager.changeZone(0);


            this._projection = Martix4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);


            this.resize();
            this.loop();
        }

        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._projection = Martix4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }
        }

        private loop(): void {
            this.update();
            this.render();
        }

        private update():void{
            let delta = performance.now() - this._previousTime;
            MessageBus.update(delta);
            ZoneManager.update(delta);
            this._previousTime = performance.now();
        }

        private render():void{
            
            gl.clear(gl.COLOR_BUFFER_BIT);

            ZoneManager.render(this._basicShader);

            let projectionPosition = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this));

        }
    }
}