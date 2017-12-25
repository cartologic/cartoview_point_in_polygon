import React from 'react'
import Styler from './point-in-polygon.jsx'
import { render } from 'react-dom'
class Viewer {
    constructor( domId, username, urls ) {
        this.domId = domId
        this.urls = urls
        this.username = username
        this.config = null
    }
    view() {
        render(
            <Styler urls={this.urls} username={this.username}/>,
            document.getElementById( this.domId ) )
    }
}
global.Viewer = Viewer
