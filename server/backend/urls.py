from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from .views import get_dealers
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # API endpoints first
    path('api/dealers/', get_dealers, name='get_dealers'),
    path('api/dealers/<str:state>/', get_dealers, name='get_dealers_by_state'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # Serve static files
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    
    # Serve React's index.html for all other routes
    re_path(r'^(?!api/).*$', TemplateView.as_view(template_name='index.html'), name='index'),
]
