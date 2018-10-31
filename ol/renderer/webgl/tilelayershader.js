/**
 * @module ol/renderer/webgl/tilelayershader
 */
// This file is automatically generated, do not edit.
// Run `make shaders` to generate, and commit the result.

import {DEBUG_WEBGL} from '../../index.js';
import WebGLFragment from '../../webgl/Fragment.js';
import WebGLVertex from '../../webgl/Vertex.js';

export const fragment = new WebGLFragment(DEBUG_WEBGL ?
  'precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  gl_FragColor = texture2D(u_texture, v_texCoord);\n}\n' :
  'precision mediump float;varying vec2 a;uniform sampler2D e;void main(void){gl_FragColor=texture2D(e,a);}');

export const vertex = new WebGLVertex(DEBUG_WEBGL ?
  'varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec4 u_tileOffset;\n\nvoid main(void) {\n  gl_Position = vec4(a_position * u_tileOffset.xy + u_tileOffset.zw, 0., 1.);\n  v_texCoord = a_texCoord;\n}\n\n\n' :
  'varying vec2 a;attribute vec2 b;attribute vec2 c;uniform vec4 d;void main(void){gl_Position=vec4(b*d.xy+d.zw,0.,1.);a=c;}');
