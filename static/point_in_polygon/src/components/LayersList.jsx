import 'react-toggle-switch/dist/css/switch.min.css'

import { Loader, NextButton } from './CommonComponents'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import Switch from 'react-toggle-switch'
import URLS from '../helpers/URLS'
import classNames from 'classnames'
import { doGet } from '../helpers/utils'
const SearchBox = ( props ) => {
  const { searchByTitle } = props
  return (
    <div className="input-group">
            <span className="input-group-addon" id="search-box"><i className="fa fa-search" aria-hidden="true"></i></span>
            <input onChange={searchByTitle} type="text" className="form-control" placeholder="Search by title" aria-describedby="search-box" />
        </div>
  )
}
SearchBox.propTypes = {
  searchByTitle: PropTypes.func.isRequired
}
export default class LayersList extends Component {
  constructor( props ) {
    super( props )
    const { urls, currentLayer } = this.props
    this.state = {
      layers: [],
      userLayers: true,
      currentPage: 1,
      limit: 9,
      totalCount: 0,
      showPagination: true,
      myLayers: true,
      selectedLayer: currentLayer,
      loading: true,
      searchEnabled: false
    }
    this.urls = new URLS( urls )
  }
  componentWillMount = () => {
    this.getLayers()
  }
  getLayers = ( offset = 0 ) => {
    this.setState( { loading: true } )
    const { username, layerType } = this.props
    let { myLayers, limit } = this.state
    const url = this.urls.getLayersApiURL( username, myLayers, limit, offset, {
      'type': layerType.toLowerCase()
    } )
    doGet( url ).then( result => {
      this.setState( {
        layers: result.objects,
        loading: false,
        totalCount: result.meta.total_count
      } )
    } )
  }
  handleSwitch() {
    this.setState( {
      myLayers: !this.state.myLayers
    }, this.getLayers )
  }
  handlePageClick = ( data ) => {
    let { limit } = this.state
    const selected = data.selected
    const offset = selected * limit
    this.getLayers( offset )
  }
  renderPagination() {
    let { totalCount, limit } = this.state
    const pageCount = Math.ceil( totalCount / limit )
    if ( pageCount == 1 ) {
      return null
    }
    return (
      <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={< a href="javascript:;" > ...</a>}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination center-div"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
    )
  }
  onComplete = () => {
    const { selectedLayer } = this.state
    let layer = { ...selectedLayer,
      typename: this.getLayerTypename( selectedLayer )
    }
    this.props.onComplete( layer )
  }
  renderHeader() {
    return (
      <div className="row">
                <div className="col-xs-5 col-md-4">
                    <h4>{'Select Layer'}</h4>
                </div>
                <div className="col-xs-7 col-md-8">
                    {this.state.selectedLayer
                        ? <NextButton clickAction={this.onComplete} />
                        : <NextButton clickAction={this.onComplete} disabled={true} />}
                </div>
            </div>
    )
  }
  search = ( text ) => {
    this.setState( { loading: true, searchEnabled: true } )
    const { username, layerType } = this.props
    const { myLayers } = this.state
    const url = this.urls.getLayersApiSearchURL( username, myLayers, text, {
      'type': layerType.toLowerCase()
    } )
    doGet( url ).then( result => {
      this.setState( {
        layers: result.objects,
        loading: false
      } )
    } )
  }
  searchByTitle = ( event ) => {
    const text = event.target.value
    if ( text !== "" ) {
      this.search( text )
    } else {
      this.setState( { searchEnabled: false }, this.getLayers )
    }
  }
  renderSwitchSearch() {
    return (
      <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 flex-element">
                    <span className="switcher-label">{'Shared Layers'}</span>
                    <Switch on={this.state.myLayers} onClick={() => this.handleSwitch()} />
                    <span className="switcher-label">{'My Layers'}</span>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                    <SearchBox searchByTitle={this.searchByTitle} />
                </div>
            </div>
    )
  }
  getLayerTypename = ( layer ) => {
    return layer.detail_url.split( '/' ).pop()
  }
  renderLayers() {
    const { layers, selectedLayer } = this.state
    return (
      <ul className="list-group">
          {layers.map((layer, i) => {
              return (
                  <div key={i}>
                      <li className={classNames("list-group-item card", { "selected-card": selectedLayer && this.getLayerTypename(selectedLayer) === this.getLayerTypename(layer) })} onClick={() => { this.setState({ selectedLayer: layer }) }} >
                          <div className="row">
                              <div className="col-xs-12 col-md-3 img-container">
                                  <img className="img-responsive card-img" src={layer.thumbnail_url} />
                              </div>

                              <div className="col-xs-12 col-md-9">
                                  <div className="content">
                                      <h4 className="list-group-item-heading" style={{
                                          marginTop: "1%"
                                      }}>{layer.title}</h4>
                                      <hr />
                                      <p className="mb-1">{`${layer.abstract.substring(0, 140)} ...`}</p>
                                      <p>{`Owner: ${layer.owner__username}`}</p>

                                      <a type="button" href={layer.detail_url} target="_blank" className="btn btn-primary pull-right card-details-button" >
                                          {"Layer Details"}
                                      </a>
                                  </div>
                              </div>
                          </div>
                      </li>
                      <br></br>
                  </div>
              )
          })}
            </ul>
    )
  }
  renderTip1() {
    return (
      <div className="panel panel-danger" style={{
                margin: "15px auto 15px auto"
            }}>
                <div className="panel-heading">No Layers</div>
                <div className="panel-body">
                    <p>{"You have not created any layers! Please create or upload layers"}</p>
                    <a className='btn btn-primary pull-right' target="_blank" href='/layers/upload'>Upload a layer</a>

                </div>
            </div>
    )
  }
  renderTip2() {
    return (
      <div className="panel panel-danger" style={{
                margin: "15px auto 15px auto"
            }}>
                <div className="panel-heading">No Layers</div>
                <div className="panel-body">
                    <p>{"You don't have layers shared with you! Please create or upload layers"}</p>
                    <a className='btn btn-primary pull-right' target="_blank" href='/layers/upload'>Upload a layer</a>

                </div>
            </div>
    )
  }
  render() {
    let { layers, myLayers } = this.state
    return <div>
                {this.renderHeader()}
                <br />
                {this.renderSwitchSearch()}
                <br />
                {this.state.loading == true
                    ? <Loader />
                    : layers.length != 0
                        ? this.renderLayers()
                        : myLayers
                            ? this.renderTip1()
                            : this.renderTip2()}

                <div className="row">
                    <div className="col-xs-6 col-xs-offset-4 col-md-6 col-md-offset-3 text-center">
                        {this.renderPagination()}
                    </div>
                </div>
            </div>
  }
}
LayersList.propTypes = {
  username: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  currentLayer: PropTypes.object,
  urls: PropTypes.object.isRequired
}
