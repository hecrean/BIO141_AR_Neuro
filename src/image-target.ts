import { ImageFoundMsg, ImageLostMsg, ImageUpdatedMsg,ImgTrackedTransform } from './type';
import { SceneGraphCtx } from './state';
import { UserInput} from './state'

// this is used to keep track of our image targets...

export type TargetName =
    'qrcode';

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
    'qrcode': { tag: 'qrcode', transform: initTransform() },
});

const log = (name: string, _: Transform) => {
    console.log(`handling event ${name}}`);
};

const updateGlobalImageTargetTracker = (detail: ImgTrackedTransform['detail'], imageTargets: ImageTargets) => {
    imageTargets[detail.name] = createImageTarget(detail.name, {
        position: detail.position,
        rotation: detail.rotation,
        scale: detail.scale,
    });
}



export const onImageFoundListener = (userState: UserInput, sceneCtx: SceneGraphCtx, imageTargets: ImageTargets): ImageFoundMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'qrcode': {
                    const root = sceneCtx.uiComponentHandles.get('rootSurface')
                    userState.neuronRotating = true;

                    switch(userState.stage.tag){
                        case 'image-target-not-yet-seen':
                            if (root) {
                                root.visible = true;
                            }
                            updateGlobalImageTargetTracker(detail, imageTargets)
                            userState.stage = {tag: 'initial-animation-sequence'};
                           
                            break;
                       default: break;
                    }

                    break;
                }

                default:
                    break;
            }
        },
    };
};
export const onImageLostListener = (_: UserInput,): ImageLostMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'qrcode': {
                    // userState.neuronRotationDirection === 1 
                    // ? userState.neuronRotationDirection = -1
                    // : userState.neuronRotationDirection = 1

                    // userState.neuronRotating = false;
                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (userState: UserInput, imageTargets: ImageTargets): ImageUpdatedMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'qrcode': {
                    userState.neuronRotating = true
                    switch(userState.stage.tag) {
                        case 'initial-animation-sequence':
                            updateGlobalImageTargetTracker(detail, imageTargets)
                            setTimeout(() => userState.stage = {tag: 'post-initial-animation-sequence'}, 4000);
                            break;
                        case 'post-initial-animation-sequence':
                            updateGlobalImageTargetTracker(detail, imageTargets)
                            break;
                        default: break;
                    }
                    break;
                }
                
                default:
                    break;
            }
        },
    };
};
