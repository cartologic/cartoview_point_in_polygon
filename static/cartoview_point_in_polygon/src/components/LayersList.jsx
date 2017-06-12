import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";
import WFSClient from "../gs-client/WFSClient.jsx";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';


class LayersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      layers: []
    }
  }


  loadLayers(){
    WMSClient.getLayers().then((layers)=>{
      WFSClient.describeFeatureTypes(this.props.layersType).then((featureTypes) => {
        layers = layers.filter((layer) => {
          // searching array using indexOf
          if (featureTypes.indexOf(layer.name) != -1) {
            return layer
          }
        })
        this.setState({layers})
      })
    });
  }


  componentDidMount(){
    this.loadLayers()
  }


  render(){
    const {layers} = this.state;
    if(layers.length == 0){
      return <div className="loading" style={{margin: "10% auto auto"}}></div>
    }
    const {onComplete} = this.props;
    return <div>
      <h3 style={{fontFamily: "monospace"}}>
        {this.props.title}
      </h3>
      <ListGroup className="layers-list">
        {
          //to={match.url + layer.typename}
          layers.map((layer) => <div><ListGroupItem tag="a" href="#" onClick={()=>onComplete(layer.typename)} action>
            <img src={layer.thumbnail_url}/>
            <div className="content">
              <ListGroupItemHeading>{layer.title}</ListGroupItemHeading>
              <p className="mb-1">{layer.abstract}</p>
            </div>
          </ListGroupItem><br></br></div>)
        }
      </ListGroup>
    </div>;
  }
}

export default LayersList;
