import { Component } from 'react';
import GenerateLayer from './GenerateLayer.jsx'

// using reactstrap Forms
import { Alert, Link, Button, } from 'reactstrap';

export default class Results extends Component {

  render(){
    const {successState, typeName, loading} = this.props;

    // loading
    if(loading) return <div style={{margin: "10% auto auto"}} className="loading"></div>

    else{
      // Success !!!
      if(successState){
        return <div>
            <Alert  style={{margin: "10% auto auto"}} color="success">
              Layer Created Successfully
            </Alert>
            <br></br>
            <a className="btn btn-primary" href={`/layers/${typeName}`} style={{float:"right"}} role="button">Layer Details</a>
          </div>;
      }

      // Failure !!!
      if(!successState){
        return (
          <Alert style={{margin: "10% auto auto"}} color="danger">
            Faild to Create layer
          </Alert>
        )
      }
    }

  }
}
