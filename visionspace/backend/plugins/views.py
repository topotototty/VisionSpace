from django.shortcuts import render
from rest_framework.decorators import api_view


@api_view(['GET'])
def generate_manifest(request):
    domain = request.get_host()
    response = render(request, 'manifest.xml', {'domain': domain}, content_type='application/xml')
    response['Content-Disposition'] = 'attachment; filename="manifest.xml"'
    return response
