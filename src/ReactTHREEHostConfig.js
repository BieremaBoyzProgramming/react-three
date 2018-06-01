import * as THREE from 'three';
import * as ReactScheduler from './react-scheduler';

export function appendInitialChild(parentInstance, child) {
  if (parentInstance instanceof THREE.Mesh) {
    if (child instanceof THREE.BoxGeometry) {
      parentInstance.geometry = child;
      return;
    }
    if (child instanceof THREE.MeshBasicMaterial) {
      parentInstance.material = child;
      return;
    }
  }
  if (parentInstance instanceof THREE.Scene) {
    if (child instanceof THREE.Mesh) {
      parentInstance.add(child);
      return;
    }
  }
  throw new Error(`Not implemented ${child.constructor.name}`);
}

function applySceneProps(instance, props, prevProps = {}) {

}

function applyPerspectiveCameraProps(instance, props, prevProps = {}) {

}

function applyBoxGeometryProps(instance, props, prevProps = {}) {

}

function applyMeshBasicMaterialProps(instance, props, prevProps = {}) {

}

function applyMeshProps(instance, props, prevProps = {}) {
  instance.rotation.x = props.rotation.x;
  instance.rotation.y = props.rotation.y;
  instance.rotation.z = props.rotation.z;
}

export function createInstance(type, props, internalInstanceHandle) {
  let instance;

  switch (type) {
    case 'Scene':
      instance = new THREE.Scene();
      instance._applyProps = applySceneProps;
      break;
    case 'PerspectiveCamera':
      instance = new THREE.PerspectiveCamera(props.fov, props.aspect, props.near, props.far);
      instance.position.x = props.position.x;
      instance.position.y = props.position.y;
      instance.position.z = props.position.z;
      instance._applyProps = applyPerspectiveCameraProps;
      break;
    case 'BoxGeometry':
      instance = new THREE.BoxGeometry(props.width, props.height, props.depth);
      instance._applyProps = applyBoxGeometryProps;
      break;
    case 'MeshBasicMaterial':
      instance = new THREE.MeshBasicMaterial({ color: props.color });
      instance._applyProps = applyMeshBasicMaterialProps;
      break;
    case 'Mesh':
      instance = new THREE.Mesh();
      instance.rotation.x = props.rotation.x;
      instance.rotation.y = props.rotation.y;
      instance.rotation.z = props.rotation.z;
      instance._applyProps = applyMeshProps;
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

// The THREE renderer is secondary to the React DOM renderer.
export const isPrimaryRenderer = false;

export const supportsMutation = true;

export function appendChild(parentInstance, child) {
  throw new Error('Not implemented');
  if (child.parentNode === parentInstance) {
    child.eject();
  }
  child.inject(parentInstance);
}

export function appendChildToContainer(parentInstance, child) {
  if (parentInstance instanceof THREE.WebGLRenderer) {
    if (child instanceof THREE.Scene) {
      parentInstance._scene = child;
      return;
    }
    if (child instanceof THREE.PerspectiveCamera) {
      parentInstance._camera = child;
      return;
    }
  }
  throw new Error(`Not implemented ${child.constructor.name}`);
}

export function insertBefore(parentInstance, child, beforeChild) {
  throw new Error('Not implemented');
  if (child === beforeChild) throw new Error('ReactTHREE: Can not insert node before itself');
  child.injectBefore(beforeChild);
}

export function insertInContainerBefore(parentInstance, child, beforeChild) {
  throw new Error('Not implemented');
  if (child !== beforeChild) throw new Error('ReactTHREE: Can not insert node before itself');
  child.injectBefore(beforeChild);
}

export function removeChild(parentInstance, child) {
  throw new Error('Not implemented');
  child.eject();
}

export function removeChildFromContainer(parentInstance, child) {
  throw new Error('Not implemented');
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
