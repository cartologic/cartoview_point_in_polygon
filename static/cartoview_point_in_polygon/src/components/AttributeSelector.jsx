import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";
import { ListGroup, ListGroupItem } from 'reactstrap';

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
      return <div style={{margin: "10% auto auto"}} className="loading"></div>
    }
    const {onComplete, filter} =  this.props;
    const isGeom = (a) => {
      return a.attribute_type.toLowerCase().indexOf("gml:") == 0;
    }

    return <div>
        <h3 style={{fontFamily: "monospace"}}>Select attribute</h3>
        <ListGroup>
          {
            attrs.map(a => isGeom(a) || !filter(a) ? null : <ListGroupItem tag="a" href="#" onClick={()=>onComplete(a.attribute)}>
              {a.attribute_label || a.attribute} ({a.attribute_type})
            </ListGroupItem>)
          }
        </ListGroup>
      </div>;
  }
}
export default AttributeSelector;
