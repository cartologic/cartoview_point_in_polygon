import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";


class AttributeSelector extends Component {
  state = {
    attrs: []
  }
  componentDidMount(){
    const {layerName} = this.props.config;
    WMSClient.getLayerAttributes(layerName).then((attrs)=>{
      this.setState({attrs});
    });
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

    return <div>
        <p>Select attribute</p>
        <ul className="list-group">
          {
            attrs.map(a => isGeom(a) || !filter(a) ? null : <li className="list-group-item"  onClick={()=>onComplete(a.attribute)} style={{marginTop: "4px"}}>
              {a.attribute_label || a.attribute} ({a.attribute_type})
            </li>)
          }
        </ul>
      </div>;
  }
}
export default AttributeSelector;
