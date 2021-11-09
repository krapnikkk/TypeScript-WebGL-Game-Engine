namespace TSE{
    export abstract class BaseComponent implements IComponent {
        protected _owner:SimObject;
        public name:string;
        protected _data:IComponentData;
        public constructor(data:IComponentData){
            this._data = data;
            this.name = data.name;
        };

        public get owner():SimObject{
            return this._owner;
        }

        public setOwner(owner:SimObject):void{
            this._owner = owner;
        }
        public load():void{
            
        }
        public update(time:number):void{

        };
        public render(shader:Shader):void{

        };
    }
}