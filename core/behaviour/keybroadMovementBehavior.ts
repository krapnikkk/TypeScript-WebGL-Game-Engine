/// <reference path = "BaseBehavior.ts" />
/// <reference path = "BehaviorManager.ts" />
namespace TSE {
    export class KeybroadMovementBehaviorData implements IBehaviorData {
        name: string;
        speed: number = 0.1;
        setFromJson(json: any): void {
            if (json.name == undefined) {
                throw new Error("Name must be defined in behavior data.");
            }
            this.name = json.name;
            if (json.speed == undefined) {
                throw new Error("speed must be defined in behavior data.");
            }
            this.speed = json.speed;
        }
    }

    export class KeybroadMovementBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "keybroadMovement";
        };
        public buildFromJson(json: any): IBehavior {
            let data = new KeybroadMovementBehaviorData();
            data.setFromJson(json);
            return new KeybroadMovementBehavior(data);
        }

    }

    export class KeybroadMovementBehavior extends BaseBehavior {
        speed: number = 0.1;
        public constructor(data: KeybroadMovementBehaviorData) {
            super(data);

            this.speed = data.speed;
        }

        update(time: number): void {
            if (InputManager.isKeyDown(Keys.LEFT)) {
                this._owner.transform.position.x -= this.speed;
            }
            if (InputManager.isKeyDown(Keys.RIGHT)) {
                this._owner.transform.position.x += this.speed;
            }
            if (InputManager.isKeyDown(Keys.UP)) {
                this._owner.transform.position.y -= this.speed;
            }
            if (InputManager.isKeyDown(Keys.DOWN)) {
                this._owner.transform.position.y += this.speed;
            }
            super.update(time);
        }
    }

    BehaviorManager.registerBuilder(new KeybroadMovementBehaviorBuilder);
}

