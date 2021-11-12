namespace TSE {
    export abstract class BaseBehavior implements IBehavior {
        name: string;
        protected _data: IBehaviorData;
        protected _owner:SimObject;

        public constructor(data: IBehaviorData) {
            this._data = data;
            this.name = this._data.name;
        }

        setOwner(owner:SimObject):void{
            this._owner = owner;

        }
        update(time:number):void{

        }
        apply(userData:any):void{

        }
    }
}