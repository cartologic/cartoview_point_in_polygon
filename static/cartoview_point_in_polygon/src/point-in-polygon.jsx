import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// components
import AboutPage from './components/AboutPage.jsx'
import LayersList from './components/LayersList.jsx'
import Navigator from './components/Navigator.jsx'
import AttributeSelector from './components/AttributeSelector.jsx'
import NewLayerName from './components/NewLayerName.jsx'
import Results from './components/Results.jsx'

import {DefaultModalStyle} from './constants/constants.jsx'
import Modal from 'react-modal';

import "../css/styler.css";

class ConfigForm extends Component {
  state = {
    config: {
      outputLayerName: ""
    },
    step: 0,
    saved: false,
    loading: true,

    modalIsOpen: false
  }

  goToStep(step) {
    this.setState({step});
  }

  updateConfig(newConfig, sameStep) {
    var {config, step} = this.state;
    Object.assign(config, newConfig);
    if (!sameStep)
      step++;
    const saved = false;
    this.setState({config, step, saved});
  }

  aboutHeader() {
    return (
      <h3>Point in Polygon</h3>
    )
  }

  aboutBody() {
    return (
      <div>
        <p>
          Computes statistics for the distribution of a given attribute in a set of polygonal zones for point layer & save the result in a new geonode/geoserver layer
        </p>

        <p>
          The output layer carries the same characteristic of the selected polygon layer, It has the same attributes of the polygon layer in addition to another 6 attributes represent the statistics [count, min, max, sum, avg, stddev(standard deviation)]
        </p>

        <div className="row">
          <div className='col-xs-12 col-md-10 col-md-offset-1'>
            <img className='img-responsive' src={`/static/${APP_NAME}/images/point-in-polygon-example.jpg`} alt=""/>
          </div>
        </div>
      </div>
    )
  }

  helpModal() {
    return (
      <Modal className="modal-dialog" isOpen={this.state.modalIsOpen} style={DefaultModalStyle} onRequestClose={() => {
        this.setState({modalIsOpen: false})
      }}>
        <div className="">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="row">
                <div className="col-xs-6 col-md-6">
                  {this.aboutHeader()}
                </div>
                <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-5">
                  <div className="pull-right">
                    <a className="btn btn btn-primary" onClick={(e) => {
                      e.preventDefault();
                      this.setState({modalIsOpen: false})
                    }}>
                      x
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
        </div>
      </Modal>
    )
  }

  navBar() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <h4 style={{
                color: "dimgray"
              }}>Point in Polygon</h4>
            </div>
            <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-4">
              <button type="button" style={{
                marginTop: "8%"
              }} className="btn btn-primary" onClick={() => {
                this.setState({modalIsOpen: true})
              }}>
                ?
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  render() {
    var {config, step, saved} = this.state
    const steps = [
      {
        label: "Select Point Layer",
        component: LayersList,
        props: {
          onComplete: (layerName) => {
            this.updateConfig({layerName})
          },
          layerType: "Point"
        }
      }, {
        label: "Select Statistics Attribute",
        component: AttributeSelector,
        props: {
          onComplete: (attribute) => this.updateConfig({attribute}),
          filter: a => a.attribute_type.toLowerCase() != "xsd:string",
          tip: "Statistics attributes are only available for this step"
        }
      }, {
        label: "Select Polygon Layer",
        component: LayersList,
        props: {
          onComplete: (layerName) => {
            this.updateConfig({layerName})
          },
          layerType: "Polygon"
        }
      }, {
        label: "Output Layer Name",
        component: NewLayerName,
        props: {
          onChange: (outputLayerName) => this.updateConfig({
            outputLayerName
          }, true),
          showResults: (WPSResponse) => {
            if (WPSResponse.success) {
              this.setState({successState: true, typeName: WPSResponse.type_name, loading: false})
            } else {
              this.setState({successState: false, loading: false})
            }
          },
          onComplete: () => {
            this.updateConfig({});
            this.setState({loading: true});
          },
          layerType: ""
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
    ];

    return (
      <div className="col-md-12">
        {this.helpModal()}
        <div className="row">{this.navBar()}</div>
        <div className="row">
          <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)}/>
          <div className="col-md-9">
            {steps.map((s, index) => index == step && <s.component {...s.props} config={config}/>)
}
          </div>
        </div>
      </div>
    )
  }
}

global.ConfigForm = ConfigForm;
global.React = React;
global.ReactDOM = ReactDOM;
export default ConfigForm;
