import { Component } from 'react';
import slugify from 'slugify';

// reactstrap
import { Button } from 'reactstrap';

export default class GenerateLayer extends Component {

  onClick(){
    let formValues = this.props.config
    let form = new FormData();
    form.append("PointLayer", formValues.layerName);
    form.append("Attribute", formValues.attribute);
    form.append("PolygonLayer", formValues.polygonLayerName);
    form.append("newLayerName", slugify(formValues.outputLayerName, '_'));

    fetch('generate-layer',{
      method:"POST",
       body:form,
       credentials: "include",
       headers: new Headers({
         "X-CSRFToken": CSRF_TOKEN
       })
     }).then(res => res.json()).then(WPSResponse=>{
      //  WPSResponse.success && this.props.showResults(true)
      //  !WPSResponse.success && this.props.showResults(false, WPSResponse.server_response)
      this.props.showResults(WPSResponse)
     })
  }
  render(){
    return <Button onClick={()=>{this.props.onComplete(); this.onClick();}}>Generate Layer</Button>
  }
}
