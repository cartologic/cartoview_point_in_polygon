import { Component } from 'react'
import Select from 'react-select'

import "../../css/react-select.min.css";

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state={
      inputValue: "",
    }
  }


  componentDidMount(){
    const layerTypeNames = this.props.layerTypeNames
    this.setState({layerTypeNames})
  }


  logChange(val){
    if (val)
      this.setState({inputValue: val.value}, ()=>this.props.searchLayers(val.value));
    else {
      this.setState({inputValue: ""}, ()=>this.props.searchLayers(null))
    }
  }


  render(){
    return (
      <Select
        name="form-field-name"
        placeholder = "Search Layers"
        value = {this.state.inputValue}
        options={this.state.layerTypeNames!=undefined?this.state.layerTypeNames:[]}
        onChange={(value)=>this.logChange(value)}
        arrowRenderer = {()=> false}
        noResultsText={'No Layers Found!!'}
        />
    )
  }
}
