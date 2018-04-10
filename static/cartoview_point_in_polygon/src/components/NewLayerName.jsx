import { Loader, NextButton, PreviousButton } from './CommonComponents'

import { Component } from 'react'
import React from 'react'
import { getCRSFToken } from 'Source/helpers/helpers'
import t from 'tcomb-form'

const alphaNumericRegex = /(^[A-Za-z0-9_]+$)/
const regx = RegExp('^[A-Za-z0-9_]+$')
const Form = t.form.Form
const AlphaNumeric = t.refinement( t.String, ( n ) => {
  let valid = false
  if ( regx.test(n)) {
    valid = true
  }
  return valid
} )
AlphaNumeric.getValidationErrorMessage = ( value ) => {
  if ( !value ) {
    return 'Required'
  } else if ( !value.match( alphaNumericRegex ) ) {
    return 'Only (AlphaNumeric,_) Allowed and numbers not allowed as prefix'
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
      error: false
    }
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
  render() {
    const { onComplete } = this.props
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
}
