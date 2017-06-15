from django.conf.urls import patterns, url, include
import views
from . import APP_NAME
from api import LayerTypeResource, LayerResource
from tastypie.api import Api


Resources_api = Api(api_name="api")
Resources_api.register(LayerTypeResource())
Resources_api.register(LayerResource())


urlpatterns = patterns('',
    url(r'^$', views.index, name='%s.index' % APP_NAME),

    # generates layer from geoserver
    url(r'^generate-layer$', views.generate_layer, name='%s.generate_layer' % APP_NAME),

    # special api to get special layers attributes
    # /api/layers || /api/layer-type/?attribute_type__contains=Point
    url(r'^', include(Resources_api.urls)),
)
