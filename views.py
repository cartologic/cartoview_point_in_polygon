import json
import requests
import uuid

from decimal import Decimal

from guardian.shortcuts import get_objects_for_user

from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext as _

from geonode.layers.models import Layer, Attribute
from geonode.geoserver.helpers import ogc_server_settings
from geoserver.catalog import Catalog

from . import APP_NAME, __version__


username, password = ogc_server_settings.credentials
gs_catalog = Catalog(ogc_server_settings.internal_rest, username, password)


@login_required
def index(request):

    request = request
    context = {
        "v": __version__,
        "pnppath":"http://"+request.get_host(),
        "ogc": ogc_server_settings.LOCATION,
        "APP_NAME": APP_NAME,
        "username": request.user
    }
    return render(request, "%s/index.html" % APP_NAME, context)


def _get_permitted_queryset(request, permission):
    ''' returns qs of layers for a specific user asper permission'''
    permitted_ids = get_objects_for_user(request.user, permission).values('id')
    queryset = Layer.objects.filter(id__in=permitted_ids)
    return queryset


def update_geonode(request, resource):
    ''' Creates a table for the layer created in geoserver'''
    layer, created = Layer.objects.get_or_create(name=resource.name, defaults={
        "workspace": resource.workspace.name,
        "store": resource.store.name,
        "storeType": resource.store.resource_type,
        "typename": "%s:%s" % (resource.workspace.name.encode('utf-8'), resource.name.encode('utf-8')),
        "title": resource.title or 'No title provided',
        "abstract": resource.abstract or unicode(_('No abstract provided')).encode('utf-8'),
        "owner": request.user,
        "uuid": str(uuid.uuid4()),
        "bbox_x0": Decimal(resource.latlon_bbox[0]),
        "bbox_x1": Decimal(resource.latlon_bbox[1]),
        "bbox_y0": Decimal(resource.latlon_bbox[2]),
        "bbox_y1": Decimal(resource.latlon_bbox[3])
    })
    layer.save()


@login_required
def generate_layer(request):
    '''
    # if user has permissions
    1. Create a layer in geoserver using:
        . PointLayer, PolygonLayer, Attribute to make statistcis & new LayerName
        . xml generated from 'wps builder gui'
        . headers
        . requests.request() which accepts request methods in addition to all of the above

    # if the layer successfuly created in geoserver
    2. get the layer from geoserver and pass it to > update_geonode()

    # if the layer updated in geonode
    3. return json success or failure
    '''

    response = ''
    geoserver_url = ogc_server_settings.LOCATION

    if request.method == "POST":
        point_layer = request.POST['PointLayer']
        polygon_layer = request.POST['PolygonLayer']
        # check if user has permission to perform
        qs = _get_permitted_queryset(request, 'base.view_resourcebase')
        if(not qs.filter(typename__in=[point_layer,polygon_layer]).count() == 2):
            # return HttpResponse("User: {} has no permission to perform this process!".format(request.user))
            return HttpResponse(json.dumps({'error':"permission error"}),content_type="application/json",status_code=405)

        attribute = request.POST['Attribute']
        new_feature_layer = request.POST['newLayerName']
        url = geoserver_url+"wps"

        # using template litral instead of concatinating strings with new lines
        payload = xml = """
            <p0:Execute
              xmlns:p0="http://www.opengis.net/wps/1.0.0"
              xmlns:geonode="http://www.geonode.org/" service="WPS" version="1.0.0">
              <p1:Identifier
                xmlns:p1="http://www.opengis.net/ows/1.1">gs:Import
              </p1:Identifier>
              <p0:DataInputs>
                <p0:Input>
                  <p1:Identifier
                    xmlns:p1="http://www.opengis.net/ows/1.1">features
                  </p1:Identifier>
                  <p0:Reference p6:href="http://geoserver/wps"
                    xmlns:p6="http://www.w3.org/1999/xlink" method="POST" mimeType="text/xml; subtype=wfs-collection/1.0">
                    <p0:Body>
                      <p0:Execute service="WPS" version="1.0.0">
                        <p1:Identifier
                          xmlns:p1="http://www.opengis.net/ows/1.1">vec:VectorZonalStatistics
                        </p1:Identifier>
                        <p0:DataInputs>
                          <p0:Input>
                            <p1:Identifier
                              xmlns:p1="http://www.opengis.net/ows/1.1">data
                            </p1:Identifier>
                            <p0:Reference p3:href="http://geoserver/wfs"
                              xmlns:p3="http://www.w3.org/1999/xlink" method="POST" mimeType="text/xml">
                              <p0:Body>
                                <p2:GetFeature
                                  xmlns:p2="http://www.opengis.net/wfs" service="WFS" version="1.1.0" outputFormat="GML2">
                                  <p2:Query typeName="{}" srsName="EPSG:4326"/>
                                </p2:GetFeature>
                              </p0:Body>
                            </p0:Reference>
                          </p0:Input>
                          <p0:Input>
                            <p1:Identifier
                              xmlns:p1="http://www.opengis.net/ows/1.1">dataAttribute
                            </p1:Identifier>
                            <p0:Data>
                              <p0:LiteralData>{}</p0:LiteralData>
                            </p0:Data>
                          </p0:Input>
                          <p0:Input>
                            <p1:Identifier
                              xmlns:p1="http://www.opengis.net/ows/1.1">zones
                            </p1:Identifier>
                            <p0:Reference p5:href="http://geoserver/wfs"
                              xmlns:p5="http://www.w3.org/1999/xlink" method="POST" mimeType="text/xml">
                              <p0:Body>
                                <p4:GetFeature
                                  xmlns:p4="http://www.opengis.net/wfs" service="WFS" version="1.1.0" outputFormat="GML2">
                                  <p4:Query typeName="{}" srsName="EPSG:4326"/>
                                </p4:GetFeature>
                              </p0:Body>
                            </p0:Reference>
                          </p0:Input>
                        </p0:DataInputs>
                        <p0:ResponseForm>
                          <p0:RawDataOutput>
                            <p1:Identifier
                              xmlns:p1="http://www.opengis.net/ows/1.1">statistics
                            </p1:Identifier>
                          </p0:RawDataOutput>
                        </p0:ResponseForm>
                      </p0:Execute>
                    </p0:Body>
                  </p0:Reference>
                </p0:Input>
                <p0:Input>
                  <p1:Identifier
                    xmlns:p1="http://www.opengis.net/ows/1.1">name
                  </p1:Identifier>
                  <p0:Data>
                    <p0:LiteralData>{}</p0:LiteralData>
                  </p0:Data>
                </p0:Input>
              </p0:DataInputs>
              <p0:ResponseForm>
                <p0:RawDataOutput>
                  <p1:Identifier
                    xmlns:p1="http://www.opengis.net/ows/1.1">layerName
                  </p1:Identifier>
                </p0:RawDataOutput>
              </p0:ResponseForm>
            </p0:Execute>
        """.format(point_layer, attribute, polygon_layer, new_feature_layer)

        headers = {
            'content-type': "application/xml",
            'cache-control': "no-cache",
            }


        response = requests.request("POST", url, data=payload, headers=headers)

        # if there is no errors while creating the layer in geoserver
        new_layer_name = response.text.split(':').pop(1)
        if new_layer_name == new_feature_layer:
            resource = gs_catalog.get_resource(new_layer_name)
            type_name = "%s:%s" % (resource.workspace.name.encode('utf-8'), resource.name.encode('utf-8'))
            update_geonode(request, resource)
            # return HttpResponse("Success!!\n" + response.text + ' has been created')
            return HttpResponse(json.dumps({'type_name':type_name, 'success': True}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({'success': False, 'server_response': response.text}), content_type="application/json")
