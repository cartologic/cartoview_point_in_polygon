from django.urls import re_path, include
from . import views, APP_NAME
from .api import LayerResource
from tastypie.api import Api


Resources_api = Api(api_name="api")
Resources_api.register(LayerResource())

urlpatterns = [
    # /APP_NAME
    re_path(r'^$', views.index, name='%s.index' % APP_NAME),
    # generates layer from geoserver | /APP_NAME/generate-layer
    re_path(r'^generate-layer$', views.generate_layer,
        name='%s.generate_layer' % APP_NAME),
    #
    re_path(r'^', include(Resources_api.urls)),
]
