import "../css/styler.css"

import React, {
  Component
} from 'react'

import AttributeSelector from './components/AttributeSelector.jsx'
import {
  DefaultModalStyle
} from './constants/constants.jsx'
import { ErrorModal } from './components/CommonComponents'
import LayersList from './components/LayersList.jsx'
import Modal from 'react-modal'
import Navigator from './components/Navigator.jsx'
import NewLayerName from './components/NewLayerName.jsx'
import PropTypes from 'prop-types'
import Results from './components/Results.jsx'

const numericTypes = [
  'xsd:byte',
  'xsd:decimal',
  'xsd:double',
  'xsd:int',
  'xsd:integer',
  'xsd:long',
  'xsd:negativeInteger',
  'xsd:nonNegativeInteger',
  'xsd:nonPositiveInteger',
  'xsd:positiveInteger',
  'xsd:short',
  'xsd:unsignedLong',
  'xsd:unsignedInt',
  'xsd:unsignedShort',
  'xsd:unsignedByte'
]

class PointInPolygon extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      config: {
        outputLayerName: ""
      },
      step: 0,
      pointLayer: null,
      polygonLayer: null,
      saved: false,
      error: false,
      errorMessage: "",
      loading: true,
      modalIsOpen: false
    }
  }
  goToStep( step ) {
    this.setState( {
      step
    } )
  }
  updateConfig( newConfig, sameStep ) {
    var {
      config,
      step
    } = this.state
    Object.assign( config, newConfig )
    if ( !sameStep ) {
      step++
    }
    const saved = false
    this.setState( {
      config,
      step,
      saved
    } )
  }
  aboutHeader() {
    return ( <h3>{"Point in Polygon"}</h3> )
  }
  aboutBody() {
    const { urls } = this.props
    return <div>
      <p>
        {"Computes statistics for the distribution of a given attribute in a set of polygonal zones for point layer & save the result in a new geonode/geoserver layer"}
      </p>

      <p>
        {"The output layer carries the same characteristic of the selected polygon layer, It has the same attributes of the polygon layer in addition to another 6 attributes represent the statistics [count, min, max, sum, avg, stddev(standard deviation)]"}
      </p>
      <div className="row">
        <div className='col-xs-12 col-md-10 col-md-offset-1'>
          <img className='img-responsive' src={`${urls.appStatic}/images/point-in-polygon-example.jpg`} alt="" />
        </div>
      </div>
    </div>
  }
  helpModal() {
    return <Modal className="modal-dialog" isOpen={this.state.modalIsOpen} style={DefaultModalStyle} onRequestClose={() => { this.setState({ modalIsOpen: false }) }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-6 col-md-6">
              {this.aboutHeader()}
            </div>
            <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-5">
              <div className="pull-right">
                <a className="btn btn btn-primary" onClick={(e) => {
                  e.preventDefault()
                  this.setState({ modalIsOpen: false })
                }}>
                  {"x"}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12">
              {this.aboutBody()}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  }
  navBar() {
    return (
      <div className="flex-element styler-nav">
        <h4>{"Point in Polygon"}</h4>
        <div className="fill-empty"></div>
        <button type="button" className="btn btn-primary" onClick={() => {
          this.setState({ modalIsOpen: true })
        }}>
          {"?"}
        </button>

      </div>
    )
  }
  render() {
    var {
      config,
      step,
      saved,
      errorMessage,
      error,
      pointLayer,
      polygonLayer
    } = this.state
    const {
      username,
      urls,
      workspace
    } = this.props
    const steps = [
      {
        label: "Select Point Layer",
        component: LayersList,
        props: {
          onComplete: ( layer ) => {
            this.setState( {
              pointLayer: layer
            } )
            this.updateConfig( {
              layerName: layer.typename
            } )
          },
          layerType: "Point",
          username,
          urls,
          currentLayer: pointLayer
        }
      }, {
        label: "Select Statistics Attribute",
        component: AttributeSelector,
        props: {
          onComplete: ( attribute, index ) => this.updateConfig( {
            attribute,
            selectedAttrIndex: index
          } ),
          // filter and pass only the numericTypes
          filter: a =>  numericTypes.indexOf(a.attribute_type) == -1 ? false : true,
          tip: "Numeric attributes are only available for this step",
          onPrevious: () => {
            this.setState( {
              step: this.state.step - 1
            } )
          },
          attribute: this.state.config.attribute,
          index: this.state.config.selectedAttrIndex
        }
      }, {
        label: "Select Polygon Layer",
        component: LayersList,
        props: {
          onComplete: ( layer ) => {
            this.setState( {
              polygonLayer: layer
            }, () => this.updateConfig( {
              polygonLayerName: layer.typename
            } ) )
          },
          layerType: "Polygon",
          username,
          currentLayer: polygonLayer,
          urls,
          step: step,
          onPrevious: () => {
            this.goToStep( step - 1 )
          }
        }
      }, {
        label: "Output Layer Name",
        component: NewLayerName,
        props: {
          workspace,
          urls,
          onChange: ( outputLayerName ) => this.updateConfig( {
            outputLayerName
          }, true ),
          showError: ( errorMessage =
            "Something went wrong in our backend" ) => {
            this.setState( {
              error: true,
              errorMessage
            } )
          },
          showResults: ( WPSResponse ) => {
            if ( WPSResponse.success ) {
              this.setState( {
                successState: true,
                typeName: WPSResponse.type_name,
                loading: false
              } )
            } else {
              this.setState( {
                successState: false,
                loading: false
              } )
            }
          },
          onComplete: ( outputLayerName ) => {
            this.updateConfig( {
              outputLayerName: outputLayerName
            } )
            this.setState( {
              loading: true
            } )
          },
          layerType: "",
          outputLayerName: this.state.config.outputLayerName,
          onPrevious: () => this.goToStep( step - 1 )
        }
      }, {
        label: "Results",
        component: Results,
        props: {
          successState: this.state.successState,
          typeName: this.state.typeName,
          loading: this.state.loading
        }
      }
    ]
    return (
      <div className="col-md-12">
        {this.helpModal()}
        <div className="row">{this.navBar()}</div>
        <hr />
        <ErrorModal open={error} error={errorMessage} onRequestClose={() => this.setState({ error: false })} />
        <div className="flex-element styler-nav current-info">
          {pointLayer && <a target="_blank" href={`${pointLayer.detail_url}`}>{`Point Layer: ${pointLayer.title}`}</a>}
          {config && config.attribute && <span>{`Attribute: ${config.attribute}`}</span>}
          {polygonLayer && <a target="_blank" href={`${polygonLayer.detail_url}`}>{`Polygon Layer: ${polygonLayer.title}`}</a>}
        </div>
        {(pointLayer || config.title) && <hr />}
        <div className="row">
          <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)} />
          <div className="col-md-9">
            {steps.map((s, index) => index == step && <s.component {...s.props} config={config} />)
            }
          </div>
        </div>
      </div>
    )
  }
}
PointInPolygon.propTypes = {
  username: PropTypes.string.isRequired,
  urls: PropTypes.object.isRequired
}
export default PointInPolygon
