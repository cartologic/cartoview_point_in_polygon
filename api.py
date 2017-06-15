from geonode.layers.models import Attribute, Layer
from tastypie import fields
from tastypie.authorization import DjangoAuthorization
from tastypie.resources import ModelResource, ALL


class LayerResource(ModelResource):

    class Meta:
        queryset = Layer.objects.all()
        list_allowed_methods = ['get']
        resource_name = 'layers'
        fields = ['title', 'thumbnail_url', 'abstract']
        authorization = DjangoAuthorization()


# used to filter on layers by Attribute type : Point, Polygon or line
# /?attribute_type__contains=Point | attribute_type__contains=Polygon
# make sure the first character is Big {"P"oint}
class LayerTypeResource(ModelResource):
    layer = fields.ForeignKey(LayerResource, 'layer', full=True)

    class Meta:
        queryset = Attribute.objects.all()
        list_allowed_methods = ['get']
        resource_name = 'layer-type'
        fields = ["layer", 'attribute_type']
        authorization = DjangoAuthorization()
        filtering = {
            'attribute_type': ALL,
        }