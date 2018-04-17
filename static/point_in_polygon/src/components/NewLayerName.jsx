import { Loader, NextButton, PreviousButton } from './CommonComponents'

import { Component } from 'react'
import { ErrorModal } from '../components/CommonComponents'
import React from 'react'
import { getCRSFToken } from 'Source/helpers/helpers'
import getIntersectionsCount from 'Source/helpers/layerIntersections'
import t from 'tcomb-form'

const alphaNumericRegex = /(^[A-Za-z0-9_]+$)/
const regx = RegExp('^[A-Za-z0-9_]+$')
const Form = t.form.Form
const AlphaNumeric = t.refinement( t.String, ( n ) => {
  let valid = false
  if ( regx.test(n)) {
    valid = true
  }
  if(n.length > 63){
    valid = false
  }
  return valid
} )
AlphaNumeric.getValidationErrorMessage = ( value ) => {
  if ( !value ) {
    return 'Required'
  } else {
    if ( !value.match( alphaNumericRegex ) ) {
      return 'Only (AlphaNumeric,_) Allowed and numbers not allowed as prefix'
    }
    if(value.length > 63){
      return "Layer name cannot exceed the limit of 63 characters!"
    }
  }
}
const formSchema = t.struct( {
  title: AlphaNumeric,
} )
const options = {
  fields: {
    title: {
      label: "Layer Name"
    },
  }
}
export default class LayerStyles extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      value: {
        title: this.props.outputLayerName ? this.props.outputLayerName : ""
      },
      loading: false,
      error: false,
      intersectionError: false
    }
  }
  componentDidMount(){
    this.setState({loading: true}, (
      this.isIntersected()
    ))
  }
  startProcess() {
    let formValues = this.props.config
    let form = new FormData()
    form.append( "PointLayer", formValues.layerName )
    form.append( "Attribute", formValues.attribute )
    form.append( "PolygonLayer", formValues.polygonLayerName )
    form.append( "newLayerName", this.state.value.title )
    fetch( 'generate-layer', {
      method: "POST",
      body: form,
      credentials: "include",
      headers: new Headers( { "X-CSRFToken": getCRSFToken() } )
    } ).then( res => res.json() ).then( WPSResponse => {
      if ( WPSResponse.status >= 400 ) {
        this.props.showError( WPSResponse.error )
      } else {
        this.props.showResults( WPSResponse )
      }
    } ).catch( err => this.props.showError() )
  }
  checkLayerNameExist = ( name ) => {
    const { urls } = this.props
    this.setState( { loading: true, error: false } )
    return fetch( `${urls.layersAPI}?typename=${this.props.workspace}:${name}` ).then( response =>
      response.json() )
  }
  onComplete = () => {
    const value = this.form.getValue()
    if ( value ) {
      this.checkLayerNameExist( value.title ).then( response => {
        if ( response.objects.length == 0 ) {
          this.startProcess()
          this.props.onComplete( this.state.value.title )
        } else {
          this.setState( { loading: false, error: true } )
        }
      } )
    }
  }
  onChange = ( value ) => {
    if ( this.state.value.title !== value.title ) {
      this.setState( { value: { title: value.title } } )
    }
  }
  isIntersected = () => {
    const settings = {
      url: this.props.urls.proxy+this.props.urls.wpsURL,
      CRSFToken: getCRSFToken(),
      polygonLayer: this.props.config.polygonLayerName,
      pointLayer: this.props.config.layerName
    }
    getIntersectionsCount(settings)
    .then(count => {
      if (count > 0) this.setState({loading: false, isIntersected: true})
      else this.setState({loading: false, isIntersected: false})
    })
    .catch(error => {
      error.text()
      .then (xmlError => this.setState({loading: false, intersectionError: true, xmlError: xmlError}))
    })
  }
  renderIntersectionMessage =()=>{
    return(
      <div>
        <p>It seems the selected layers are not intersected! You can continue and ignore or step back and select two different layers </p>
        <button className="btn btn-warning" style={{margin: '5px 20px'}} onClick={()=>{this.setState({isIntersected: true})}}>Continue any way</button>
        <button className="btn btn-primary" style={{margin: '5px 20px'}} onClick={()=>{this.setState({isIntersected: true}, ()=>{this.props.onPrevious()})}}>Step Back</button>
      </div>
    )
  }
  renderIntersectionError = (xmlError) =>{
    return (
      <div>
      <p>Unexpected Error while checking the intersection of the selected layers, Continue any way may cause unexpected results </p>
      <p className={'geoserver-xml-error'}>${xmlError}</p>
      <button className="btn btn-warning" style={{margin: '5px 20px'}} onClick={()=>{this.setState({intersectionError:false, isIntersected: true})}}>Continue any way</button>
      <button className="btn btn-primary" style={{margin: '5px 20px'}} onClick={()=>{this.setState({intersectionError:false, isIntersected: true}, ()=>{this.props.onPrevious()})}}>Step Back</button>
    </div>
    )
  } 
  render() {
    const { onComplete } = this.props
    if(this.state.loading){
      return <Loader />
    }
    if(this.state.intersectionError){
      return (
        <ErrorModal open={this.state.intersectionError} error={this.renderIntersectionError(this.state.xmlError)} onRequestClose={() => this.setState({ intersectionError: false, isIntersected: true })} />
      )
    }
    if(this.state.isIntersected){
      return (
        <div>
          <div className="row">
            <div className="col-xs-5 col-md-4">
              <h4>{'Enter New Layer Name'}</h4>
            </div>
            <div className="col-xs-7 col-md-8">
              <NextButton clickAction={() => this.onComplete()} />
              <PreviousButton clickAction={() => this.props.onPrevious()} />
            </div>
          </div>
          {!this.state.loading && this.state.error && <p className="text-danger">{"Layer Name already exist please choose another one"}</p>}
          {this.state.loading && <Loader/>}
          <Form
            ref={(form) => this.form = form}
            value={this.state.value}
            type={formSchema}
            onChange={this.onChange}
            options={options} />
        </div>
      )
    }
    return(
      <ErrorModal open={!this.state.isIntersected} error={this.renderIntersectionMessage()} onRequestClose={() => this.setState({ isIntersected: true })} />
    )
  }
}
