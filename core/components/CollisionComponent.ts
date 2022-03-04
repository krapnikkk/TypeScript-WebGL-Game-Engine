/// <reference path = "ComponentManager.ts" />
namespace TSE {
    export class CollisionComponentData implements IComponentData {
        public name: string;
        public shape: IShape2D;
        public setFromJson(json: any): void {
            if (json.name) {
                this.name = json.name;
            }

            if (json.shape) {
                let shapeType = json.shape.type;
                switch (shapeType) {
                    case "circle":
                        this.shape = new Circle();
                        break;
                    case "rectangle":
                        this.shape = new Rectangle();
                        break;
                }
                this.shape.setFromJson(json.shape);
            }
        }
    }

    export class CollisionComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "collision";
        }

        public buildFromJson(json: any): IComponent {
            let data = new CollisionComponentData();
            data.setFromJson(json);
            return new CollisionComponent(data);
        }

    }

    export class CollisionComponent extends BaseComponent {
        private _shape: IShape2D;
        public constructor(data: CollisionComponentData) {
            super(data);
            this._shape = data.shape;
        }

        public get shape(): IShape2D {
            return this._shape;
        }

        public load():void{
            super.load();
        }

        public update(time:number):void{
            this._shape.position.copyFrom(this.owner.transform.position.toVector2());
            super.update(time);
        }

        public render(shader: Shader): void {
            super.render(shader);
        }

        public onCollisionEntry(other:CollisionComponent):void{
            
        }

        public onCollisionUpdate(other:CollisionComponent):void{
            
        }

        public onCollisionExit(other:CollisionComponent):void{
            
        }

    }

    ComponentManager.registerBuilder(new CollisionComponentBuilder);
}