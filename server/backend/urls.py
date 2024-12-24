from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/dealers/', views.get_dealers, name='get_dealers'),
    path('api/dealers/<str:state>/', views.get_dealers, name='get_dealers_by_state'),
    
    # React routes - serve index.html for all other routes
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('<path:path>', TemplateView.as_view(template_name='index.html'), name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
