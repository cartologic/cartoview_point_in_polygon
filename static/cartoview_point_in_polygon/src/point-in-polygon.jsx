import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// components
import AboutPage from './components/AboutPage.jsx'
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


  aboutHeader(){
    return(
      <h3>Point in Polygon</h3>
    )
  }


  aboutBody(){
    return(
    <div>
      <p>
        Computes statistics for the distribution of a given attribute in a set of polygonal zones for point layer & save the result in a new geonode/geoserver layer
      </p>

      <p>
        The output layer carries the same characteristic of the selected polygon layer, It has the same attributes of the polygon layer in addition to another 6 attributes represent the statistics [count, min, max, sum, avg, stddev(standard deviation)]
      </p>

      <div style={{width:"650px", height:"300px", margin:"30px auto 30px auto"}}>
        <img src={`/static/${APP_NAME}/images/worldwide categorized thematic map.jpg`} style={{height:"inherit", width:"inherit"}} alt=""/>
      </div>
    </div>
    )
  }

  navBar(){
    return(
    <nav className="navbar navbar-default">
      <div className="container">
        <h4 style={{color:"dimgray"}}>Point in Polygon Analysis Tool</h4>
      </div>
    </nav>
    )
  }


  render() {
    var {config, step, saved} = this.state
    const steps = [{
      label: "About",
      component: AboutPage,
      props: {
        onComplete: () => this.updateConfig({}),
        aboutHeader: this.aboutHeader(),
        aboutBody: this.aboutBody()
      }
    },{
      label: "Select Point Layer",
      component: LayersList,
      props: {
        title: "Select Point Layer",
        layerType: "Point",
        onComplete: (layerName) => this.updateConfig({layerName})
      }
    },
    {
      label: "Select Statistics Attribute",
      component: AttributeSelector,
      props: {
        onComplete: (attribute) => this.updateConfig({attribute}),
        filter: a => a.attribute_type.toLowerCase() != "xsd:string",
        tip: "The numeric type attributes only are selectable to perform the purpose of this app"
      }
    },
    {
      label: "Select Polygon Layer",
      component: LayersList,
      props: {
        title: "Select Polygon Layer",
        layerType: "Polygon",
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
        onComplete: ()=>{this.updateConfig({}); this.setState({loading: true});},
        layerType:""
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
        <div className="row">{this.navBar()}</div>
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
