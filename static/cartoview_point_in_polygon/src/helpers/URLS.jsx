import UrlAssembler from 'url-assembler'
class URLS {
  constructor( urls ) {
    this.urls = urls
  }
  encodeURL = ( url ) => {
    return encodeURIComponent( url ).replace( /%20/g, '+' )
  }
  getParamterizedURL ( url, query ) {
    return UrlAssembler( url ).query( query ).toString()
  }
  getLayersApiURL = ( username, userMaps = false, limit, offset, query = {} ) => {
    let params = {
      'limit': limit,
      'offset': offset,
      ...query
    }
    if ( userMaps ) {
      params[ 'owner__username' ] = username
    }
    const url = UrlAssembler( this.urls.layersAPI ).query( params ).toString()
    return url
  }
  getLayersApiSearchURL = ( username, userMaps = false, text, query = {} ) => {
    let params = { 'title__contains': text, ...query }
    if ( userMaps ) {
      params[ 'owner__username' ] = username
    }
    const url = UrlAssembler( this.urls.layersAPI ).query( params ).toString()
    return url
  }
  getProxiedURL = ( url ) => {
    const proxy = this.urls.proxy
    let proxiedURL = url
    if ( proxy ) {
      proxiedURL = this.urls.proxy + this.encodeURL( url )
    }
    return proxiedURL
  }
}
export default URLS
