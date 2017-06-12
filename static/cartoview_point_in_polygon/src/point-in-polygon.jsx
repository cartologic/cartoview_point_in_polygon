import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// components
import LayersList from './components/LayersList.jsx'
import Navigator from './components/Navigator.jsx'
import AttributeSelector from './components/AttributeSelector.jsx'
import NewLayerName from './components/NewLayerName.jsx'
import Results from './components/Results.jsx'

import "../css/styler.css";

class ConfigForm extends Component {
  state = {
    config: {outputLayerName: ""},
    step: 0,
    saved: false,
    loading: true
  }


  goToStep(step){
    this.setState({step});
  }


  updateConfig(newConfig, sameStep){
    var {config, step} = this.state;
    Object.assign(config, newConfig);
    if(!sameStep) step++;
    const saved = false;
    this.setState({config, step, saved});
  }


  render() {
    var {config, step, saved} = this.state
    const steps = [{
      label: "Select Point Layer",
      component: LayersList,
      props: {
        title: "Select Point Layer",
        layersType: "point",
        onComplete: (layerName) => this.updateConfig({layerName})
      }
    },
    {
      label: "Select Statistics Attribute",
      component: AttributeSelector,
      props: {
        onComplete: (attribute) => this.updateConfig({attribute}),
        filter: a => a.attribute_type.toLowerCase() != "xsd:string"
      }
    },
    {
      label: "Select Polygon Layer",
      component: LayersList,
      props: {
        title: "Select Polygon Layer",
        layersType: "polygon",
        onComplete: (layerName) => this.updateConfig({polygonLayerName: layerName})
      }
    },
    {
      label: "Output Layer Name",
      component: NewLayerName,
      props: {
        onChange: (outputLayerName) => this.updateConfig({outputLayerName}, true),
        showResults: (WPSResponse) => {
          if(WPSResponse.success){
            this.setState({successState:true, typeName: WPSResponse.type_name, loading: false})
          }
          else{
            this.setState({successState:false, loading: false})
          }
        },
        onComplete: ()=>{this.updateConfig({}); this.setState({loading: true});}
      }
    },
    {
      label: "Results",
      component: Results,
      props: {
        successState: this.state.successState,
        typeName: this.state.typeName,
        loading: this.state.loading,
      }
    },
    ];


    return  (
      <div className="col-md-12">
        <div className="row">
          <Navigator steps={steps} step={step} onStepSelected={(step)=>this.goToStep(step)}/>
          <div className="col-md-9">
            {
              steps.map((s,index) => index == step && <s.component {...s.props} config={config}/>)
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
