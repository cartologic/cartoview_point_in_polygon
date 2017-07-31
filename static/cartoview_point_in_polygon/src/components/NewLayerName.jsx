import {Component} from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";

import slugify from 'slugify';

export default class NewLayerName extends Component {
  state = {
    title: this.props.outputLayerName || ''
  }

  startProcess() {
    let formValues = this.props.config
    let form = new FormData();
    form.append("PointLayer", formValues.layerName);
    form.append("Attribute", formValues.attribute);
    form.append("PolygonLayer", formValues.polygonLayerName);
    form.append("newLayerName", slugify(this.state.title, '_'));

    fetch('generate-layer', {
      method: "POST",
      body: form,
      credentials: "include",
      headers: new Headers({"X-CSRFToken": CSRF_TOKEN})
    }).then(res => res.json()).then(WPSResponse => {
      this.props.showResults(WPSResponse)
    })
  }

  validateInput() {
    const {title} = this.state;
    if (title.trim() === "") {
      this.setState({error: true, errorMessage: "Enter a valid layer name!"});
    } else if (this.state.LayersTitles.indexOf(title) > -1) {
      this.setState({error: true, errorMessage: "Layer name is already taken! Please Enter another layer name"});
    } else {
      this.setState({
        error: false
      }, () => {
        this.startProcess();
        this.props.onComplete(this.state.title)
      });
    }
  }

  componentDidMount() {
    let url = `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}`
    fetch(url, {credentials: 'include'}).then((res) => res.json()).then((layers) => {
      let LayersTitles = layers.objects.map((layer) => {
        return layer.title
      })
      this.setState({LayersTitles})
    })
  }

  renderHeader() {
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4">
          <h4>{'Layer Name'}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={"btn btn-primary btn-sm pull-right"} onClick={() => {
            this.validateInput();
          }}>{"next >>"}</button>

          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={() => {
            this.props.onPrevious()
          }}>{"<< Previous"}</button>
        </div>
      </div>
    )
  }

  render() {
    const {title, error, errorMessage} = this.state;

    const {config, onComplete} = this.props;

    return (
      <div>
        {this.renderHeader()}
        <div className={error
          ? "form-group has-error"
          : "form-group"}>
          {error && <label className="control-label" htmlFor="inputError1">{errorMessage}</label>}
          <input type="text" className="form-control" id="inputError1" placeholder="New Layer Title" value={title} onChange={e => this.setState({title: e.target.value})}/>
        </div>
      </div>
    )
  }
}
