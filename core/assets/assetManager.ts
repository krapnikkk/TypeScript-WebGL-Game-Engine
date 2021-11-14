namespace TSE {
    export const MESSAGE_ASSET_LOADED_ASSET_LOADED = "MESSAGE_ASSET_LOADED_ASSET_LOADED";
    export class AssetManager {
        private static _loaders: IAssetLoader[] = [];
        private static _loaderAssets: { [name: string]: IAsset } = {};

        private constructor() {

        }

        public static initialize(): void {
            AssetManager._loaders.push(new ImageAssetLoader());
            AssetManager._loaders.push(new JsonAssetLoader());
        }

        public static registerLoader(loader: IAssetLoader): void {
            AssetManager._loaders.push(loader);
        }

        public static loadAsset(assetName: string): void {
            let extension = assetName.split(".").pop().toLowerCase();
            for (let l of AssetManager._loaders) {
                if (l.supportedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension "+extension+"because there is no loader associated with it.")
        }

        public static onAssetLoaded(asset:IAsset):void{
            AssetManager._loaderAssets[asset.name] = asset;
            Message.send(MESSAGE_ASSET_LOADED_ASSET_LOADED  + asset.name,this,asset);
        }

        public static isAssetLoaded(assetName: string): boolean {
            return AssetManager._loaderAssets[assetName] !== undefined;
        }

        public static getAsset(assetName: string): IAsset {
            if (AssetManager._loaderAssets[assetName] != undefined) {
                return AssetManager._loaderAssets[assetName];
            } else {
                AssetManager.loadAsset(assetName);
            }

            return undefined;
        }
    }
}