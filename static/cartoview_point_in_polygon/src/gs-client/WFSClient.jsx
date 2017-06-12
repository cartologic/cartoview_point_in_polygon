

class WFSClient {
  url = URLS.geoserver + "wfs"
  _attributsCache = {}

  describeFeatureTypes(type){
    // returns featureTypes(layers) for a specific type "Polygon, Line or Point layers"
    const url = this.url + "?service=wfs&request=DescribeFeatureType&version=2.0.0&outputFormat=application%2Fjson";
    return fetch(url, {credentials: 'include'}).then(res=>res.json()).then((res)=>{
            const featureTypes = [];
            res.featureTypes.forEach(fType => {
              fType.properties.forEach(attr => {
                if(attr.type.startsWith('gml')){
                  // searching string or array using indexOf
                  // type: point, polygon or line
                  if(attr.type.toLowerCase().indexOf(type) != -1 ){
                    featureTypes.push(fType.typeName)
                  }
                  return false;
                }
              })
            })
            return featureTypes;
          })
  }
}

export default new WFSClient();
