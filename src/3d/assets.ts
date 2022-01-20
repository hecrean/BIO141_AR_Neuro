import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { SVGLoader, SVGResult, SVGResultPaths } from 'three/examples/jsm/loaders/SVGLoader';
import { Shape, Texture, Color, TextureLoader } from 'three';
import { taskEither as te, option as o, io, console } from 'fp-ts';
import { pipe } from 'fp-ts/function';

interface AssetMap {
    gltf: { tag: 'gltf'; rawAsset: GLTF; processedAsset: GLTF; loader: GLTFLoader };
    texture: { tag: 'texture'; rawAsset: Texture; processedAsset: Texture; loader: TextureLoader };
    svg: { tag: 'svg'; rawAsset: SVGResult; processedAsset: Array<SVGUnit>; loader: SVGLoader };
}
type Tag = keyof AssetMap;
type ProcessedAsset<K extends Tag> = AssetMap[K]['processedAsset'];
type RawAsset<K extends Tag> = AssetMap[K]['rawAsset'];

type SVGUnit = {
    shape: Shape;
    color: Color;
    index: number;
};

interface AssetCache<K extends Tag> {
    log: Array<string>;
    loader: AssetMap[K]['loader'];
    cache: Map<string, AssetMap[K]['processedAsset']>;
}

interface AssetApi<K extends Tag> {
    get: (cache: AssetCache<K>, url: string) => o.Option<ProcessedAsset<K>>;
    set: (cache: AssetCache<K>, key: string, value: ProcessedAsset<K>) => io.IO<void>;
    load: (cache: AssetCache<K>, url: string) => te.TaskEither<Error, RawAsset<K>>;
    process: (raw: RawAsset<K>) => ProcessedAsset<K>;
    log: <A>(a: A) => io.IO<void>;
}

export interface AssetsCtx {
    texture: { api: AssetApi<'texture'>; cache: AssetCache<'texture'> };
    svg: { cache: AssetCache<'svg'>; api: AssetApi<'svg'> };
    gltf: { cache: AssetCache<'gltf'>; api: AssetApi<'gltf'> };
}

export const initAssetCtx = (): AssetsCtx => ({
    texture: {
        cache: { log: [], loader: new TextureLoader(), cache: new Map<string, Texture>() },
        api: {
            get: ({ cache }, url) => {
                return o.fromNullable(cache.get(url));
            },
            set:
                ({ cache }, key, value) =>
                () =>
                    cache.set(key, value),

            load: (cache, url) => {
                const onProgress = (event: ProgressEvent<EventTarget>) => {
                    console.log(event);
                };
                return pipe(
                    te.tryCatch(
                        () => cache.loader.loadAsync(url, onProgress),
                        (reason) => new Error(`${reason}`),
                    ),
                );
            },
            log: (a) => () => console.log(a),
            process: (rawTexture) => rawTexture,
        },
    },
    svg: {
        cache: { log: [], loader: new SVGLoader(), cache: new Map<string, Array<SVGUnit>>() },
        api: {
            get: ({ cache }, url) => {
                return o.fromNullable(cache.get(url));
            },
            set:
                ({ cache }, key, value) =>
                () =>
                    cache.set(key, value),
            load: (cache, url) => {
                const onProgress = () => ({});
                return pipe(
                    te.tryCatch(
                        () => cache.loader.loadAsync(url, onProgress),
                        (reason) => new Error(`${reason}`),
                    ),
                );
            },
            log: (a) => () => console.log(a),
            process: (rawSvg: SVGResult) => {
                return rawSvg.paths.flatMap((g: SVGResultPaths, index: number) =>
                    g.toShapes(true).map((shape: Shape) => ({ shape, color: g.color, index })),
                );
            },
        },
    },
    gltf: {
        cache: { log: [], loader: new GLTFLoader(), cache: new Map<string, GLTF>() },
        api: {
            get: ({ cache }, url) => {
                return o.fromNullable(cache.get(url));
            },
            set:
                ({ cache }, key, value) =>
                () =>
                    cache.set(key, value),
            load: (cache, url) => {
                const onProgress = () => ({});
                return pipe(
                    te.tryCatch(
                        () => cache.loader.loadAsync(url, onProgress),
                        (reason) => new Error(`${reason}`),
                    ),
                );
            },
            log: (a) => () => console.log(a),
            process: (rawGltf) => rawGltf,
        },
    },
});

export type AssetBundle = { tag: Tag; urls: string[] };
// ulity functions
export const loadAssetBundle = <K extends Tag>(api: AssetApi<K>, cache: AssetCache<K>, { urls }: AssetBundle) => {
    const getAndCacheTextureData = (url: string) =>
        pipe(
            api.load(cache, url),
            te.map(api.process),
            te.chain((processedAsset) =>
                pipe(
                    te.fromIO(api.set(cache, url, processedAsset)),
                    te.map((_) => processedAsset),
                ),
            ),
        );

    const taskEithers = urls.map(getAndCacheTextureData);

    return te.sequenceSeqArray(taskEithers);
};
