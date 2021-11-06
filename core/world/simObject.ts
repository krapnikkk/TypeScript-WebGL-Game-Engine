module TSE {
    export class SimObject {
        private _id: number;
        private _children: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _scene: Scene;
        private _components: BaseComponent[] = [];

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

        public addComponent(component:BaseComponent):void{
            this._components.push(component);
            component.setOwner(this);
        }

        public load(): void {
            this._isLoaded = true;
            for (let child of this._children) {
                child.load();
            }
            for (let component of this._components) {
                component.load();
            }
        }

        public update(time: number): void {
            this._localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this.parent!==undefined)?this._parent.worldMatrix:undefined);
            for (let child of this._children) {
                child.update(time);
            }
            for (let component of this._components) {
                component.update(time);
            }
        }

        public render(shader: Shader): void {
            for (let child of this._children) {
                child.render(shader);
            }

            for (let component of this._components) {
                component.render(shader);
            }
        }

        public onAdded(scene: Scene): void {
            this._scene = scene;
        }

        private updateWorldMatrix(parentWorldMatrix:Martix4):void{
            if(parentWorldMatrix!== undefined){
                this._worldMatrix = Martix4.multiply(parentWorldMatrix,this._localMatrix);
            }else{
                this._worldMatrix.copyFrom(this._localMatrix);
            }
        }
    }
}