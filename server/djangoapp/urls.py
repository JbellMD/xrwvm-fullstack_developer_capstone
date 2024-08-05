from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # path for registration
    path('register', view=views.registration, name='register'),
    # path for login
    path('login', view=views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),
    # other paths
    path('get_cars', view=views.get_cars, name='get_cars'),
    path('get_dealers', view=views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', view=views.get_dealerships, 
         name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', view=views.get_dealer_details, 
         name='dealer_details'),
    path('reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, 
         name='dealer_details'),
    # path for add a review view
    path('add_review', view=views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
