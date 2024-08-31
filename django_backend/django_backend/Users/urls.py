from django.urls import path
from .views import login_user, register_user, create_game, get_game, get_all_games, update_game, delete_game
from .serializers import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('login/',login_user, name='login'),
    path('games/', get_all_games, name='get_all_games'),
    path('games/<int:game_id>/', get_game, name='get_game'),
    path('games/<int:game_id>/update/', update_game, name='update_game'),
    path('game/', create_game, name='create_game'),
    path('games/<int:game_id>/delete/', delete_game),  
]
