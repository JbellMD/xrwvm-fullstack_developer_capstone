"""
djangoproj URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from . import api

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # React routes
    path('', TemplateView.as_view(template_name='index.html')),
    path('dealer/<int:dealer_id>/', 
         TemplateView.as_view(template_name="index.html")),
    path('postreview/<int:dealer_id>/', 
         TemplateView.as_view(template_name="index.html")),
    
    # API endpoints
    path('api/dealers/', api.get_dealers, name='get_dealers'),
    path('api/dealers/<str:state>/', api.get_dealers, name='get_dealers_by_state'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Add this to handle React Router
urlpatterns += [
    path('<path:path>', TemplateView.as_view(template_name='index.html')),
]
