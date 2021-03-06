import { Object3D, Group } from 'three';
import { UIElement, UIElementHandles, PIXEL } from './element-factory';

type vec3 = [number, number, number];
type vec4 = [number, number, number, number];
type Transform = { position: vec3; rotation: vec4; scale: vec3 };

type Layout = Array<{
    tag: string;
    transform: Transform;
    children: {
        transform: Transform;
        element: UIElement<Object3D>;
    }[];
}>;

export const initLayout = (elements: UIElementHandles): Layout => {
    return [
        {
            tag: 'biogenAndTismaPanel',
            transform: { position: [1200 * PIXEL, 125 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 370 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.btnLinc,
                },
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.btnSma,
                },
            ],
        },
        {
            tag: 'auroraAppPanel',
            transform: { position: [1200 * PIXEL, -360 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.auroraApp,
                },
                {
                    transform: { position: [150 * PIXEL, -130 * PIXEL, 0.1], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.auroraAppDownloadButtonAndroid,
                },
                {
                    transform: { position: [150 * PIXEL, -330 * PIXEL, 0.1], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.auroraAppDownloadButtonMac,
                },
            ],
        },
        {
            tag: 'teamInfoPanel',
            transform: { position: [-1200 * PIXEL, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 740 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.teamHeader,
                },
                {
                    transform: { position: [0, 370 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.eva,
                },
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.ed,
                },
                {
                    transform: { position: [0, -370 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.raph,
                },
            ],
        },
        {
            tag: 'neuronPanel',
            transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.neuronModel,
                },
            ],
        },
        {
            tag: 'auroraVideoPanel',
            transform: { position: [950 * PIXEL, -1800 * PIXEL, -0.1], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.auroraVideo,
                },
            ],
        },
        {
            tag: 'edwardWelcomeVideoPanel',
            transform: { position: [-950 * PIXEL, -1800 * PIXEL, -0.1], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.edwardWelcomeVideo,
                },
            ],
        },
        {
            tag: 'headerPanel',
            transform: { position: [0, 1100 * PIXEL, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
            children: [
                {
                    transform: { position: [0, 0, 0], rotation: [0, 0, 0, 0], scale: [1, 1, 1] },
                    element: elements.header,
                },
            ],
        },
    ];
};

export const parseLayout = (layout: Layout): Map<string, Group> => {
    const components: Map<string, Group> = new Map();

    const rootSurface = new Group();
    rootSurface.position.set(100, 0, 0);
    components.set('rootSurface', rootSurface);

    const setTransform = (group: Object3D, transform: Transform) => {
        const { position, rotation, scale } = transform;

        group.position.set(position[0], position[1], position[2]);
        group.rotation.set(rotation[0], rotation[1], rotation[2]);
        group.scale.set(scale[0], scale[1], scale[2]);
    };

    layout.map((component) => {
        const group = new Group();
        setTransform(group, component.transform);

        const children = component.children.map(({ transform, element }) => {
            setTransform(element.mesh, transform);
            return element.mesh;
        });
        group.add(...children);
        components.set(component.tag, group);
        rootSurface.add(group);
    });

    return components;
};
