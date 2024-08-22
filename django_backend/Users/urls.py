from django.urls import path
from .views import register_user
from django.conf import settings
from django.conf.urls.static import static
from .views import MyTokenObtainPairView, register_user


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
]