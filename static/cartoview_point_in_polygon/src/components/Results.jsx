import { Component } from 'react';

// using reactstrap Forms
import { Alert } from 'reactstrap';

export default class Results extends Component {
  note(){
    return(
      <div className="panel panel-info">
        <div className="panel-heading">Process Successfully Completed</div>
        <div className="panel-body">
          <div className="row">
            <div className="col-xs-12 col-md-12">
              The result of this process has been published as a portal layer. You can view the result and further configure the properties and set permission of the resulting Layer:
              <span style={{fontWeight:"bold"}}>
                {this.props.typeName.split(':').pop()}
              </span>
            </div>
          </div>

          <div className="row" style={{marginTop:"3%"}}>
            <div className="col-xs-10 col-md-3 col-md-offset-9 col-xs-offset-1">
              <a className="btn btn-primary" href={`/layers/${this.props.typeName}`} style={{float:"right"}} role="button">Layer Details</a>
            </div>
          </div>

        </div>
      </div>
    )
  }


  render(){
    const {successState, typeName, loading} = this.props;

    // loading
    if(loading) return <div style={{margin: "10% auto auto"}} className="loading"></div>

    else{
      // Success !!!
      if(successState){
        return this.note()
      }

      // Failure !!!
      if(!successState){
        return (
          <div className="panel panel-danger">
            <div className="panel-heading">Process Faild</div>
            <div className="panel-body">
              <div className="row">
                <div className="col-xs-12 col-md-12">
                  {"Error causes will be shown here"}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

  }
}
