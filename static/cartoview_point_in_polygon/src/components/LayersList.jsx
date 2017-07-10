import { Component } from 'react';
import WMSClient from "../gs-client/WMSClient.jsx";

import Search from "./Search.jsx";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';


class LayersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      layers: [],
      currentPage: 1,
      limit_offset: "limit=5",
      showPagination: true
    }
  }


  loadLayers(){
    let url = `/apps/${APP_NAME}/api/layers/?type=${this.props.layerType}&${this.state.limit_offset}`
    fetch(url, {credentials: 'include',}).then((res) => res.json()).then((layers) => {
      this.setState({layers:layers.objects, next:layers.meta.next, prev:layers.meta.previous})
    })
  }


  searchLayers(layerTypeName){
    if(layerTypeName){
      let url = `/apps/cartoview_point_in_polygon/api/layers/?typename=${layerTypeName}&type=${this.props.layerType}`
      fetch(url, {credentials: 'include',})
      .then((res) => res.json())
      .then((layers) => {
        this.setState({layers:layers.objects, showPagination: false})
      })
    }
    else{
      // clear button
      this.setState({showPagination: true}, ()=>this.loadLayers())
    }
  }


  onPaginationClick(e, step){
    e.preventDefault()

    switch (step) {
      case "prev":
      if(this.state.prev)
        this.setState({currentPage: this.state.currentPage-=1, limit_offset: this.state.prev}, ()=>{
          this.loadLayers();
        })
        break;
      case "next":
        if(this.state.next)
        this.setState({currentPage: this.state.currentPage+=1, limit_offset: this.state.next}, ()=>{
          this.loadLayers();
        })
        break;
    }
  }


  componentDidMount(){
    this.loadLayers();
  }


  pagination(){
    return(
      <ul className="pagination">
        <li><a onMouseDown={(e)=>this.onPaginationClick(e, "prev")} style={{cursor:"default"}}>{"<"}</a></li>
        <li><a onMouseDown={(e)=>e.preventDefault()} style={{cursor:"default"}}>{this.state.currentPage}</a></li>
        <li><a onMouseDown={(e)=>this.onPaginationClick(e, "next")} style={{cursor:"default"}}>{">"}</a></li>
      </ul>
    )
  }


  render(){
    const {layers} = this.state;
    if(layers.length == 0){
      return <div className="loading"></div>
    }
    const {onComplete} = this.props;
    return (
      <div>
        <h4>{"Select layer "}</h4>

        <Search layerType={this.props.layerType} searchLayers={(layerName)=>{this.searchLayers(layerName)}}/>
        <br></br>

        <ul className="list-group">
          {
            layers.map((layer) => {return(
              <div>
                <li className="list-group-item">
                  <div className="row">

                    <div className="col-xs-12 col-md-3"><img src={layer.thumbnail_url} style={{width:"100%"}}/></div>

                    <div className="col-xs-12 col-md-9">
                      <div className="content">
                        <h4 className="list-group-item-heading" style={{marginTop: "1%"}}>{layer.title}</h4>
                        <hr></hr>
                        <p className="mb-1">{`${layer.abstract.substring(0,140)} ...`}</p>

                        <a
                          type="button"
                          href={`/layers/${layer.typename}`}
                          target="_blank"
                          className="btn btn-primary"
                          style={{margin: "5px", float: "right"}}>
                          Layer Details
                        </a>

                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={()=>onComplete(layer.typename)}
                          style={{margin: "5px", float: "right"}}>
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                <br></br>
              </div>
            )})
          }
        </ul>
        <div className="row">
          <div className="col-xs-6 col-xs-offset-4 col-md-2 col-md-offset-5">
          {this.state.showPagination && this.pagination()}
          </div>
        </div>
      </div>
    )
  }
}

export default LayersList;
