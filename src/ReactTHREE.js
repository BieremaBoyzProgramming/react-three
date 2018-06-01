import React from 'react';
import ReactFiberReconciler from 'react-reconciler';
import * as THREE from 'three';

import * as ReactTHREEHostConfig from './ReactTHREEHostConfig';

const THREERenderer = ReactFiberReconciler(ReactTHREEHostConfig);

export class WebGLRenderer extends React.Component {
  constructor(props) {
    super(props);
    this._canvasRef = React.createRef();
  }

  componentDidMount() {
    this._webGLRenderer = new THREE.WebGLRenderer({ canvas: this._canvasRef.current });
    this._webGLRenderer.setSize(this.props.width, this.props.height);

    this._mountNode = THREERenderer.createContainer(this._webGLRenderer);
    THREERenderer.updateContainer(this.props.children, this._mountNode, this);

    const animate = () => {
      window.requestAnimationFrame(animate);
      this.props.onAnimate();
    };

    animate();
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;

    THREERenderer.updateContainer(this.props.children, this._mountNode, this);

    this._webGLRenderer.render(this._webGLRenderer._scene, this._webGLRenderer._camera);
  }

  componentWillUnmount() {
    THREERenderer.updateContainer(null, this._mountNode, this);
  }

  render() {
    return <canvas
      ref={this._canvasRef}
      style={this.props.style}
    />
  }
}

export const Scene = 'Scene';
export const PerspectiveCamera = 'PerspectiveCamera';
export const Mesh = 'Mesh';
export const BoxGeometry = 'BoxGeometry';
export const MeshBasicMaterial = 'MeshBasicMaterial';
