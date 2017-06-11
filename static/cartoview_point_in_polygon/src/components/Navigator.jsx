import { Component } from 'react';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';

class Navigator extends Component {
  state = {}
  render(){
    const {steps} = this.props;
    return <div className="col-md-3 list-group">
        <ListGroup>
          {steps.map((s, index) => this.item(s.label, index) )}
        </ListGroup>
      </div>
  }
  item(label, index){
    const {step, onStepSelected} = this.props;
    return (
      <ListGroupItem tag="a" href="#"
        disabled={index > step}
        active={index == step}
        onClick={e => onStepSelected(index)}>
        <div className="col-md-10">
          {label}
        </div>
        <div className="col-md-2">
          {index < step && <i className="fa fa-check" aria-hidden="true"></i> }
        </div>
      </ListGroupItem>
    )
  }
}
export default Navigator;
