import React from 'react';
import ReactFiberReconciler from 'react-reconciler';
import * as THREE from 'three';

import * as ReactTHREEHostConfig from './ReactTHREEHostConfig';

const THREERenderer = ReactFiberReconciler(ReactTHREEHostConfig);

class WebGLRenderer extends React.Component {
  componentDidMount() {
    this._webGLRenderer = new THREE.WebGLRenderer();

    this._mountNode = THREERenderer.createContainer(this._webGLRenderer);
    THREERenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentWillUnmount() {
    THREERenderer.updateContainer(null, this._mountNode, this);
  }

  render() {
    // This is going to be a placeholder because we don't know what it will
    // actually resolve to because ART may render canvas, vml or svg tags here.
    // We only allow a subset of properties since others might conflict with
    // ART's properties.
    const props = this.props;

    // TODO: ART's Canvas Mode overrides surface title and cursor
    const Tag = Mode.Surface.tagName;

    return this._webGLRenderer.domElement;
  }
}
