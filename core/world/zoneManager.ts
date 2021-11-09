namespace TSE {
    export class ZoneManager implements IMessageHandler {

        private static _globalZoneID: number = -1;
        // private static _zones: { [id: number]: Zone } = {};
        private static _registeredZones: { [id: number]: string } = {};
        private static _activeZone: Zone;
        private static _inst: ZoneManager;

        private constructor() {

        }
        onMessage(message: Message): void {
            if (message.code.indexOf(MESSAGE_ASSET_LOADED_ASSET_LOADED) != -1) {
                let asset = message.context as JsonAsset;
                ZoneManager.loadZone(asset);
            }
        }

        public static initialize(): void {
            ZoneManager._inst = new ZoneManager();
            ZoneManager._registeredZones[0] = "assets/zones/testZone.json";

        }

        // public static createZone(name: string, description: string): number {
        //     ZoneManager._globalZoneID++;
        //     let zone = new Zone(ZoneManager._globalZoneID, name, description);
        //     ZoneManager._zones[ZoneManager._globalZoneID] = zone;
        //     return ZoneManager._globalZoneID;
        // }

        // todo
        // public static createTestZone():number{
        //     ZoneManager._globalZoneID++;
        //     let zone = new TestZone(ZoneManager._globalZoneID, "test", "a simple test zone");
        //     ZoneManager._zones[ZoneManager._globalZoneID] = zone;
        //     return ZoneManager._globalZoneID;
        // }

        public static changeZone(id: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
                ZoneManager._activeZone = undefined;
            }

            if (ZoneManager._registeredZones[id] !== undefined) {
                if (AssetManager.isAssetLoaded(ZoneManager._registeredZones[id])) {
                    let asset = AssetManager.getAsset(ZoneManager._registeredZones[id]);
                    this.loadZone(asset);
                } else {
                    Message.subscribe(MESSAGE_ASSET_LOADED_ASSET_LOADED + "::" +ZoneManager._registeredZones[id], ZoneManager._inst);
                    AssetManager.loadAsset(ZoneManager._registeredZones[id]);
                }
            } else {
                throw new Error(`Zone id:${id.toString()} does not exist.`);
            }
        }

        public static loadZone(asset: JsonAsset): void {
            let zoneData = asset.data;
            let zoneId: number;
            if (zoneData.id == undefined) {
                throw new Error("zone id no present");
            } else {
                zoneId = +zoneData.id;
            }
            let zoneName = zoneData.name;
            let zoneDescription = zoneData.description;
            ZoneManager._activeZone = new Zone(zoneId, zoneName, zoneDescription);
            ZoneManager._activeZone.initialize(zoneData);
            ZoneManager._activeZone.onActivated();
            ZoneManager._activeZone.load();
        }

        public static update(time: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(time);
            }
        }

        public static render(shader: Shader): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        }
    }
}

