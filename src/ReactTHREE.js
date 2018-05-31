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

    this._mountNode = THREERenderer.createContainer(this._webGLRenderer);
    THREERenderer.updateContainer(this.props.children, this._mountNode, this);

    this._webGLRenderer.render(this.props.children._scene, this.props.children._camera);
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
