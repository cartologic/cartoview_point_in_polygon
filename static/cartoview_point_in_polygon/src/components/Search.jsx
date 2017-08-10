import {Component} from 'react'
import Select from 'react-select'

import "../../css/react-select.min.css";

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: "",
      layerTypeNames: [],
      myLayers: this.props.myLayers
    }
  }

  loadLayers() {
    let url = this.state.myLayers == true
      ? `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}&owner=${username}`
      : `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}`
    fetch(url, {credentials: 'include'}).then((res) => res.json()).then((layers) => {
      let layerTypeNames = layers.objects.map((layer) => {
        return {value: layer.typename, label: layer.title}
      })
      this.setState({layerTypeNames})
    })
  }

  componentDidMount() {
    this.loadLayers()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.myLayers != this.props.myLayers) {
      this.setState({
        myLayers: nextProps.myLayers,
        inputValue: ""
      }, () => {
        this.loadLayers()
      })
    }
  }

  logChange(val) {
    if (val)
      this.setState({
        inputValue: val.value
      }, () => this.props.searchLayers(val.value));
    else {
      this.setState({
        inputValue: ""
      }, () => this.props.searchLayers(null))
    }
  }

  render() {
    return (<Select name="form-field-name" placeholder="Search Layers" value={this.state.inputValue} options={this.state.layerTypeNames != undefined
      ? this.state.layerTypeNames
      : []} onChange={(value) => this.logChange(value)} arrowRenderer= {()=> false} noResultsText={'No Layers Found!!'}/>)
  }
}
