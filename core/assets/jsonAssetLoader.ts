namespace TSE {
    export class JsonAsset implements IAsset {
        public readonly name: string;
        public readonly data: any;
        public constructor(name: any, data: string) {
            this.data = data;
            this.name = name;
        }
    }
    export class JsonAssetLoader implements IAssetLoader {
        public get supportedExtensions(): string[] {
            return ["json"];
        }

        loadAsset(assetName: string): void {
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open("GET", assetName);
            request.addEventListener("load", this.onJsonLoaded.bind(this, assetName, request))
            request.send();
        }

        private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
            console.log("onImageLoaded:", assetName, request);
            if (request.readyState === request.DONE) {
                let json = JSON.parse(request.responseText)
                let asset = new JsonAsset(assetName, json);
                AssetManager.onAssetLoaded(asset);
            }
        }


    }
}