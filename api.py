from geonode.api.api import ProfileResource
from geonode.api.authorization import GeoNodeAuthorization
from geonode.layers.models import Attribute, Layer
from guardian.shortcuts import get_objects_for_user
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.resources import ModelResource, ALL
from tastypie import fields


class LayerResource(ModelResource):
    owner = fields.ToOneField(ProfileResource, 'owner', full=True)

    class Meta:
        queryset = Layer.objects.all()
        list_allowed_methods = ['get']
        resource_name = 'layers'
        fields = ['title', 'thumbnail_url', 'abstract', 'typename',
                  'detail_url',"owner"]
        authorization = GeoNodeAuthorization()
        filtering = {
            'typename': ALL,
            'id': ALL,
            "owner": ALL_WITH_RELATIONS
        }

    def dehydrate_owner(self, bundle):
        return {'username': bundle.obj.owner.username, 'id': bundle.obj.owner.id}

    # to serialize geometry_type | serialize a new field
    # hint: make a new methode with: dehydrate_new_field(self, bundle)
    # geometry_type = fields.CharField(readonly=True)
    # def dehydrate_geometry_type(self, bundle):
    #     return bundle.obj.attribute_set.get(attribute_type__contains="gml:").attribute_type


    def apply_filters(self, request, applicable_filters):
        layer_type = request.GET.get('type', None)
        typename = request.GET.get('typename', None)
        owner = request.GET.get('owner', None)

        filters = {}
        if typename:
            filters.update(dict(typename__exact=typename))
        if layer_type:
            filters.update(dict(attribute_set__in=Attribute.objects.filter(
                attribute_type__contains=layer_type)))
        if owner:
            filters.update(dict(owner__username=owner))
        else:
            permitted_ids = get_objects_for_user(request.user, 'base.view_resourcebase').values('id')
            filters.update(dict(id__in=permitted_ids))
        return  super(LayerResource, self).apply_filters(request, filters)

