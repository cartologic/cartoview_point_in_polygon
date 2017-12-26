import { Loader, NextButton, PreviousButton, Tip } from './CommonComponents'
import React, { Component } from 'react'

import WMSClient from "../gs-client/WMSClient.jsx"
import classNames from 'classnames'
export default class AttributeSelector extends Component {
  state = {
    attrs: [],
    selectedIndex: this.props.index ? this.props.index : -1,
    selectedAttribute: this.props.attribute ? this.props.attribute : ''
  }
  componentDidMount() {
    const { layerName } = this.props.config
    WMSClient.getLayerAttributes( layerName ).then( ( attrs ) => {
      this.setState( { attrs } )
    } )
  }
  onComplete() {
    this.props.onComplete( this.state.selectedAttribute, this.state.selectedIndex )
  }
  render() {
    const { attrs } = this.state
    if ( attrs.length == 0 ) {
      return <Loader />
    }
    const { onComplete, filter, tip } = this.props
    const isGeom = ( a ) => {
      return a.attribute_type.toLowerCase().indexOf( "gml:" ) == 0
    }
    return (
      <div>
          <div className="row">
              <div className="col-xs-5 col-md-4">
                  <h4>{'Select Attribute'}</h4>
              </div>
              <div className="col-xs-7 col-md-8">
                  <NextButton disabled={this.state.selectedAttribute ? false : true} clickAction={() => this.onComplete()} />
                  <PreviousButton clickAction={() => this.props.onPrevious()} />
              </div>
          </div>

          <ul className="list-group">
              {attrs.map((a, i) => isGeom(a) || !filter(a)
                  ? null
                  : <li className={classNames("list-group-item li-attribute", { "li-attribute-selected": this.state.selectedIndex == i })} onClick={() => {
                      this.setState({ selectedAttribute: a.attribute, selectedIndex: i })
                  }}>
                      {a.attribute_label || a.attribute}
                      ({a.attribute_type})
              </li>)}
          </ul>
          <div className="row">
              <div className="col-md-12">
                  <Tip text={tip} />
              </div>
          </div>
      </div>
    )
  }
}
