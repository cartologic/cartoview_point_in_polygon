import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";


export default class NewLayerName extends Component {
  state = {
    title: '',
  }


  validateInput(){
    const {title} = this.state;
    console.log(title);
    if(title.trim() === ""){
      this.setState({error:true, errorMessage: "Enter a valid layer name!"});
    }else if (this.state.LayersTitles.indexOf(title) > -1) {
      this.setState({error:true, errorMessage: "Layer name is already taken! Please Enter another layer name"});
    }

    else{
      // this.props.onComplete({styleName:"new", title, error: false})
      this.setState({error:false}, ()=>{console.log("It is okay -- Go ahead!!");});
    }
  }

  componentDidMount(){
    let url = `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}`
    fetch(url, {credentials: 'include',})
    .then((res) => res.json())
    .then((layers) => {
      let LayersTitles = layers.objects.map((layer)=>{
        return layer.title
      })
      this.setState({LayersTitles})
    })
  }


  render(){
    const {title, error, errorMessage} = this.state;

    const {config, onComplete} = this.props;


    return (
      <div>
        <div className={error ? "form-group has-error" : "form-group"}>
          <label><h4>Layer Name</h4></label><br></br>
          {error && <label className="control-label" htmlFor="inputError1">{errorMessage}</label>}
          <input type="text" className="form-control" id="inputError1" placeholder="New Layer Title" value={title} onChange={e => this.setState({title:e.target.value})}/>
        </div>

        <button type="button" className="btn btn-primary"
          onClick={() => this.validateInput()}
          style={{marginTop: "5px"}}>
          Next
        </button>
      </div>
    )
  }
}
