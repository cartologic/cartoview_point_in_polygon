from django.conf.urls import url, include
import views
from . import APP_NAME
from api import LayerResource
from tastypie.api import Api


Resources_api = Api(api_name="api")
Resources_api.register(LayerResource())

urlpatterns = [
    # /APP_NAME
    url(r'^$', views.index, name='%s.index' % APP_NAME),
    # generates layer from geoserver | /APP_NAME/generate-layer
    url(r'^generate-layer$', views.generate_layer,
        name='%s.generate_layer' % APP_NAME),
    #
    url(r'^', include(Resources_api.urls)),
]
