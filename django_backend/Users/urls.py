from django.urls import path
from .views import register_user
from django.conf import settings
from django.conf.urls.static import static
from .views import MyTokenObtainPairView, register_user, manage_profile


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('profile/', manage_profile, name='manage_profile'),  # Add this line
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)