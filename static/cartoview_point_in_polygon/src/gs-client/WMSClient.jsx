import {getUrlWithQS} from './utils.jsx'

class WMSClient {
  url = URLS.geoserver + "wms"
  _attributsCache = {}
  getLayerStyles(typeName){
    const url = getUrlWithQS(this.url, {
      SERVICE: "WMS",
      VERSION: "1.1.1",
      REQUEST: "GetStyles",
      LAYERS: typeName
    });
    return fetch(url, {
      credentials: 'include'
    }).then(res=>res.text()).then((res) => {
      var format = new OpenLayers.Format.SLD({profile: "GeoServer", multipleSymbolizers: true});
      var sld = format.read(res);
      return sld.namedLayers[typeName].userStyles;
    })

  }

  getLayers(){
    //TODO use WMS GetCapabilities
    if(this._cashedLayers){
      return new Promise((resolve, reject) => {
        resolve(this._cashedLayers);
      })

    }
    const url = URLS.rest + "geonodelayer/";
    return fetch(url, {
      credentials: 'include',
    }).then(res=>res.json()).then((res) => {
      this._cashedLayers = res.objects;
      return res.objects;
    });
  }

  getLayerAttributes(layerName){
    if(this._attributsCache[layerName]){
      return new Promise((resolve, reject) => {
        resolve(this._attributsCache[layerName]);
      })
    }
    const url = URLS.rest + "geonodelayerattribute/?layer__typename=" + layerName
    return fetch(url, {
      credentials: 'include',
    }).then(res=>res.json()).then((res) => {
      this._attributsCache[layerName] = res.objects;
      return res.objects
    });
  }

  getLayerType(layerName){
    return this.getLayerAttributes(layerName).then(attrs => {
      const geomAttr = attrs.find(a => a.attribute_type.startsWith("gml:"));
      var type;
      ["Polygon", "Line", "Point"].forEach(t => {
        if (geomAttr.attribute_type.indexOf(t) != -1){
          type = t;
          return false;
        }
      });
      return type;
    });
  }

  getLayer(layerName){

    var layer;
    if(this._cashedLayers){
      layer = this._cashedLayers.find(l => l.typename == layerName);
    }
    if(layer){
      return new Promise((resolve, reject) => {
        resolve(layer);
      })
    }
    const url = URLS.rest + "geonodelayer/?typename=" + layerName;
    return fetch(url, {
      credentials: 'include',
    }).then(res=>res.json()).then((res) => {
      layer = res.objects.find(l => l.typename == layerName);
      return layer;
    });
  }
}

export default new WMSClient();
