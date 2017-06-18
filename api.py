from geonode.layers.models import Attribute, Layer
from tastypie.authorization import DjangoAuthorization
from tastypie.resources import ModelResource, ALL
from tastypie import fields


class LayerResource(ModelResource):
    class Meta:
        queryset = Layer.objects.all()
        list_allowed_methods = ['get']
        resource_name = 'layers'
        fields = ['title', 'thumbnail_url', 'abstract', 'typename',
                  'detail_url']
        authorization = DjangoAuthorization()
        filtering = {
            'typename': ALL,
            'id': ALL
        }


    # to serialize geometry_type | serialize a new field
    # hint: make a new methode with: dehydrate_new_field(self, bundle)
    geometry_type = fields.CharField(readonly=True)
    def dehydrate_geometry_type(self, bundle):
        return bundle.obj.attribute_set.get(attribute_type__contains="gml:").attribute_type


    def apply_filters(self, request, applicable_filters):
        layer_type = request.GET.get('type', None)
        typename = request.GET.get('typename', None)
        filters = {}
        if typename:
            filters.update(dict(typename__exact=typename))
        if layer_type:
            filters.update(dict(attribute_set__in=Attribute.objects.filter(
                attribute_type__contains=layer_type)))

        return  super(LayerResource, self).apply_filters(request, filters)
        # return super(LayerResource, self).get_object_list(request).filter(**filters)
