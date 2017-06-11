from django.conf.urls import patterns, url
import views
from . import APP_NAME

urlpatterns = patterns('',
   url(r'^$', views.index, name='%s.index' % APP_NAME),

   url(r'^generate-layer$', views.generate_layer, name='%s.generate_layer' % APP_NAME),
)
