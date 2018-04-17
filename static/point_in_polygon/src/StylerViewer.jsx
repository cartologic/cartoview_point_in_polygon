import React from "react";
import Styler from "./point-in-polygon.jsx";
import { render } from "react-dom";
class Viewer {
  constructor(domId, username, urls, workspace) {
    this.domId = domId;
    this.urls = urls;
    this.username = username;
    this.config = null;
    this.workspace = workspace;
  }
  view() {
    render(
      <Styler urls={this.urls} username={this.username} workspace={this.workspace}/>,
      document.getElementById(this.domId)
    );
  }
}
global.Viewer = Viewer;
