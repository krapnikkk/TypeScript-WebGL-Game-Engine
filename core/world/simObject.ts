module TSE {
    export class SimObject {
        private _id: number;
        private _children: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _scene: Scene;

        private _localMatrix: Martix4 = Martix4.identity();
        private _worldMatrix: Martix4 = Martix4.identity();

        public name: string;
        public transform: Transform = new Transform();
        public constructor(id: number, name: string, scene?: Scene) {
            this._id = id;
            this.name = name;
            this._scene = scene;
        }

        public get id(): number {
            return this._id;
        }

        public get parent(): SimObject {
            return this._parent;
        }

        public get worldMatrix(): Martix4 {
            return this._worldMatrix;
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public addChild(child: SimObject): void {
            child._parent = this;
            this._children.push(child);
            child.onAdded(this._scene);
        }

        public removeChild(child: SimObject): void {
            let index = this._children.indexOf(child);
            if (index !== -1) {
                child._parent = null;
                this._children.splice(index, 1);
            }
        }

        public getObjectByName(name: string): SimObject {
            if (this.name === name) {
                return this;
            }
            for (let child of this._children) {
                let result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }
            return null;
        }

        public load(): void {
            this._isLoaded = true;
            for (let child of this._children) {
                child.load();
            }
        }

        public update(time: number): void {
            for (let child of this._children) {
                child.update(time);
            }
        }

        public render(shader: Shader): void {
            for (let child of this._children) {
                child.render(shader);
            }
        }

        public onAdded(scene: Scene): void {
            this._scene = scene;
        }
    }
}