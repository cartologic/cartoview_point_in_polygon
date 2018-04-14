const getPayLoad = function(polygon, point) {
  return `
    <p0:Execute
      xmlns:p0="http://www.opengis.net/wps/1.0.0"
      xmlns:opppa="localhost:8002" service="WPS" version="1.0.0">
      <p1:Identifier
        xmlns:p1="http://www.opengis.net/ows/1.1">vec:IntersectionFeatureCollection
      </p1:Identifier>
      <p0:DataInputs>
        <p0:Input>
          <p1:Identifier
            xmlns:p1="http://www.opengis.net/ows/1.1">first feature collection
          </p1:Identifier>
          <p0:Reference p3:href="http://geoserver/wfs"
            xmlns:p3="http://www.w3.org/1999/xlink" method="POST" mimeType="text/xml">
            <p0:Body>
              <p2:GetFeature
                xmlns:p2="http://www.opengis.net/wfs" service="WFS" version="1.1.0" outputFormat="GML2">
                <p2:Query typeName="${polygon}" srsName="EPSG:4326"/>
              </p2:GetFeature>
            </p0:Body>
          </p0:Reference>
        </p0:Input>
        <p0:Input>
          <p1:Identifier
            xmlns:p1="http://www.opengis.net/ows/1.1">second feature collection
          </p1:Identifier>
          <p0:Reference p5:href="http://geoserver/wfs"
            xmlns:p5="http://www.w3.org/1999/xlink" method="POST" mimeType="text/xml">
            <p0:Body>
              <p4:GetFeature
                xmlns:p4="http://www.opengis.net/wfs" service="WFS" version="1.1.0" outputFormat="GML2">
                <p4:Query typeName="${point}" srsName="EPSG:4326"/>
              </p4:GetFeature>
            </p0:Body>
          </p0:Reference>
        </p0:Input>
        <p0:Input>
          <p1:Identifier
            xmlns:p1="http://www.opengis.net/ows/1.1">intersectionMode
          </p1:Identifier>
          <p0:Data>
            <p0:LiteralData>SECOND</p0:LiteralData>
          </p0:Data>
        </p0:Input>
      </p0:DataInputs>
      <p0:ResponseForm>
        <p0:RawDataOutput mimeType="application/json">
          <p1:Identifier
            xmlns:p1="http://www.opengis.net/ows/1.1">result
          </p1:Identifier>
        </p0:RawDataOutput>
      </p0:ResponseForm>
    </p0:Execute>
    `
}


/**
 *  method accepts settings as paramter: object of {wps_url, pointLayer, polygonLayer, CSRFToken}
 * @param {object} settings -.
 * @param {string} settings.url - wps url.
 * @param {string} settings.CRSFToken - polygon layer name.
 * @param {string} settings.pointLayer - point layer name.
 * @param {string} settings.polygon - polygon layer name.
 */
/**
 *  returns features count of two intersected feature collections(layers). * 
 * @return {Promise<Number>} featuresCount - promise carries features count.
 */
const intersectedFeaturesCount = function(settings) {
  return fetch(settings.url, {
    headers: new Headers({
      "content-type": "text/xml",
      "X-CSRFToken": settings.CRSFToken
    }),
    method: "POST",
    credentials: "include",
    body: getPayLoad(settings.polygonLayer, settings.pointLayer)
  })
    .then(res => res.json())
    .then(data => data.features.length)
}

export default intersectedFeaturesCount
