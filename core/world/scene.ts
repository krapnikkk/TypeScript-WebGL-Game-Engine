module TSE {
    export class Scene {
        private _root: SimObject;
        // private _

        public constructor() {
            this._root = new SimObject(0, "__ROOT__", this);
        }

        public get root(): SimObject {
            return this._root;
        }

        public get isLoaded(): boolean {
            return this._root.isLoaded;
        }

        public addObject(object: SimObject): void {
            this._root.addChild(object);
        }

        public getObject(name: string): SimObject {
            return this._root.getObjectByName(name);
        }

        public load(): void {
            this._root.load();
        }

        public update(shader: Shader): void {
            this._root.render(shader);
        }
    }
}