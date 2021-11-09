namespace TSE {
    export enum ZoneState {
        UNINITALIZED,
        LOADING,
        UPDATEING
    }
    export class Zone {
        private _id: number;
        private _name: string;
        private _description: string;
        private _scene: Scene;
        private _globalId: number = -1;
        private _state: ZoneState = ZoneState.UNINITALIZED;

        public constructor(id: number, name: string, description: string) {
            this._id = id;
            this._name = name;
            this._description = description;
            this._scene = new Scene();
        }

        public get id(): number {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }

        public get description(): string {
            return this._description;
        }

        public get scene(): Scene {
            return this._scene;
        }

        public initialize(zoneData: any) {
            if (zoneData.objects === undefined) {
                throw new Error("Zone initialization error:objects not present.");
            }
            for (let object in zoneData.objects) {
                let obj = zoneData.objects[object];

                this.loadSimObject(obj, this._scene.root);

            }
        }

        public load(): void {
            this._state = ZoneState.LOADING;
            this.scene.load();
            this._state = ZoneState.UPDATEING;
        }

        public unload(): void {

        }

        public update(time: number): void {
            if (this._state === ZoneState.UPDATEING) {
                this._scene.update(time);
            }
        }

        public render(shader: Shader): void {
            if (this._state === ZoneState.UPDATEING) {
                this._scene.render(shader);
            }
        }

        public onActivated(): void {

        }

        public onDeactivated(): void {

        }

        private loadSimObject(dataSection: any, parent: SimObject): void {
            let name: string;
            if (dataSection.name !== undefined) {
                name = dataSection.name;
                console.log(name);
            }
            this._globalId++;
            let simObjet = new SimObject(this._globalId, name, this._scene);
            if (dataSection.transform !== undefined) {
                simObjet.transform.setFromJson(dataSection.transform);
            }
            if(dataSection.components !== undefined){
                for(let element of dataSection.components){
                    let component = ComponentManager.extractComponent(element);
                    simObjet.addComponent(component);
                }
            }
            if (dataSection.children !== undefined) {
                for (let object of dataSection.children) {
                    this.loadSimObject(object, simObjet);
                }
            }

            if(parent !== undefined){
                parent.addChild(simObjet);
            }
        }
    }
}