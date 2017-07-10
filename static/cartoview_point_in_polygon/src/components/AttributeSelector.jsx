import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";


export default class AttributeSelector extends Component {
  state = {
    attrs: []
  }


  componentDidMount(){
    const {layerName} = this.props.config;
    WMSClient.getLayerAttributes(layerName).then((attrs)=>{
      this.setState({attrs});
    });
  }


  tip(){
    return(
      <div className="panel panel-info" style={{margin: "15px auto 15px auto"}}>
        <div className="panel-heading">Tip:</div>
        <div className="panel-body">
          {this.props.tip}
        </div>
      </div>
    )
  }


  render(){
    const {attrs} = this.state;
    if(attrs.length == 0){
      return <div className="loading"></div>
    }
    const {onComplete, filter} =  this.props;
    const isGeom = (a) => {
      return a.attribute_type.toLowerCase().indexOf("gml:") == 0;
    }

    return(
      <div>
        <h4>Select attribute</h4>
        <ul className="list-group">
          {
            attrs.map(a => isGeom(a) || !filter(a) ? null : <li className="list-group-item"  onClick={()=>onComplete(a.attribute)} style={{marginTop: "4px"}}>
              {a.attribute_label || a.attribute} ({a.attribute_type})
            </li>)
          }
        </ul>

        {this.tip()}
      </div>
    )
  }
}
