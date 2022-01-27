import { ImageFoundMsg, ImageLostMsg, ImageUpdatedMsg } from './type';
import { SceneGraphCtx } from './state';
import { UserInput} from './state'
// this is used to keep track of our image targets...

export type TargetName =
    // | 'Eva-Thoma-front'
    // | 'Eduard-Rohrbach-front'
    // | 'Raphael-Bieri-front'
    // | 'business_card'
    'r42-business-card';

type Transform = {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: number;
};
export const initTransform = () => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
    scale: 0,
});

type ImageTarget<T extends TargetName> = { tag: T; transform: Transform };

const createImageTarget = (tag: TargetName, transform: Transform) => ({ tag, transform });

export type ImageTargets = { [T in TargetName]: ImageTarget<T> };

export const initImageTargets = (): ImageTargets => ({
    'r42-business-card': { tag: 'r42-business-card', transform: initTransform() },
});

const log = (name: string, _: Transform) => {
    console.log(`handling event ${name}}`);
};


export const onImageFoundListener = (userState: UserInput, sceneCtx: SceneGraphCtx, imageTargets: ImageTargets): ImageFoundMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {

                
                   
                    imageTargets[detail.name] = createImageTarget(detail.name, {
                        position: detail.position,
                        rotation: detail.rotation,
                        scale: detail.scale,
                    });
                       
                    const root = sceneCtx.uiComponentHandles.get('rootSurface')
                    if (root) {
                        root.visible = true;
                    }

                    break;
                }

                default:
                    break;
            }
        },
    };
};
export const onImageLostListener = (): ImageLostMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {
                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (imageTargets: ImageTargets): ImageUpdatedMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {
                    imageTargets[detail.name] = createImageTarget(detail.name, {
                        position: detail.position,
                        rotation: detail.rotation,
                        scale: detail.scale,
                    });
         
                    break;
                }
                default:
                    break;
            }
        },
    };
};
