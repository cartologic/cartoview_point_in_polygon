import { Component } from 'react'


export default class AboutPage extends Component {
  render(){
    return(
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="panel-title">
              {this.props.aboutHeader}
            </div>
          </div>
          <div className="panel-body">
            {this.props.aboutBody}


            <button type="button"
              className="btn btn-primary"
              onClick={()=>this.props.onComplete()}
              style={{float:"right", margin:"7% 1% 0% 0% "}}>
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }
}
