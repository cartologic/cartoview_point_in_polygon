import { Component } from 'react';
import slugify from 'slugify';


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
      this.props.showResults(WPSResponse)
     })
  }
  render(){
    return <button type="button" class="btn btn-primary" onClick={()=>{this.props.onComplete(); this.onClick();}}>Generate Layer</button>
  }
}
