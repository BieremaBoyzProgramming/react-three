import * as THREE from 'three';
import * as ReactScheduler from './react-scheduler';

export function appendInitialChild(parentInstance, child) {
  if (typeof child === 'string') {
    // Noop for string children of Text (eg <Text>{'foo'}{'bar'}</Text>)
    throw new Error('Text children should already be flattened.');
  }

  child.inject(parentInstance);
}

export function createInstance(type, props, internalInstanceHandle) {
  let instance;

  switch (type) {
    case 'PerspectiveCamera':
      instance = new THREE.PerspectiveCamera(props.fov, props.aspect, props.near, props.far);
      break;
    case 'Scene':
      instance = new THREE.Scene();
      break;
    case 'BoxGeometry':
      instance = new THREE.BoxGeometry(props.width, props.height, props.depth);
      break;
    case 'MeshBasicMaterial':
      instance = new THREE.MeshBasicMaterial(props.color);
      break;
    case 'Mesh':
      instance = new THREE.Mesh(props.geometry, props.material);
      break;
  }

  if(!instance) throw new Error(`ReactTHREE does not support the type "${type}"`);

  return instance;
}

export function createTextInstance(
  text,
  rootContainerInstance,
  internalInstanceHandle,
) {
  return text;
}

export function finalizeInitialChildren(domElement, type, props) {
  return false;
}

export function getPublicInstance(instance) {
  return instance;
}

export function prepareForCommit() {
  // Noop
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return {};
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(domElement) {
  // Noop
}

export function shouldDeprioritizeSubtree(type, props) {
  return false;
}

export function getRootHostContext() {
  return {};
}

export function getChildHostContext() {
  return {};
}

export const scheduleDeferredCallback = ReactScheduler.scheduleWork;
export const cancelDeferredCallback = ReactScheduler.cancelScheduledWork;

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  );
}

export const now = ReactScheduler.now;

// The ART renderer is secondary to the React DOM renderer.
export const isPrimaryRenderer = false;

export const supportsMutation = true;

export function appendChild(parentInstance, child) {
  if (child.parentNode === parentInstance) {
    child.eject();
  }
  child.inject(parentInstance);
}

export function appendChildToContainer(parentInstance, child) {
  if (child.parentNode === parentInstance) {
    child.eject();
  }
  child.inject(parentInstance);
}

export function insertBefore(parentInstance, child, beforeChild) {
  if (child === beforeChild) throw new Error('ReactTHREE: Can not insert node before itself');
  child.injectBefore(beforeChild);
}

export function insertInContainerBefore(parentInstance, child, beforeChild) {
  if (child !== beforeChild) throw new Error('ReactTHREE: Can not insert node before itself');
  child.injectBefore(beforeChild);
}

export function removeChild(parentInstance, child) {
  child.eject();
}

export function removeChildFromContainer(parentInstance, child) {
  child.eject();
}

export function commitTextUpdate(textInstance, oldText, newText) {
  // Noop
}

export function commitMount(instance, type, newProps) {
  // Noop
}

export function commitUpdate(
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
) {
  instance._applyProps(instance, newProps, oldProps);
}
