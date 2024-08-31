from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .serializers import UserRegisterSerializer, MyTokenObtainPairSerializer, GameSerializer
from Users.models import CustomUser, Game

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
        '/api/login',
        '/api/games',
        '/api/games/<int:game_id>',
        '/api/games/<int:game_id>/update',
    ]
    return Response(routes)

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')

    if CustomUser.objects.filter(username=username).exists():
        return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserRegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username_or_email = request.data.get('username_or_email')
    password = request.data.get('password')
    
    user = CustomUser.objects.filter(email=username_or_email).first() or CustomUser.objects.filter(username=username_or_email).first()

    if user is None:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not user.check_password(password):
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        'refresh': str(refresh),
        'access': access_token,
        # 'username': user.username,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_game(request):
    username = request.data.get('player1')
    print(username)
    if not username:
        return Response({'message': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        player1 = CustomUser.objects.get(id=username)
    except CustomUser.DoesNotExist:
        return Response({'message': 'Player 1 not found'}, status=status.HTTP_404_NOT_FOUND)

    game = Game(player1=player1, player2=None, moves="", fen="")
    game.save()

    serializer = GameSerializer(game)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_game(request, game_id):
    game = get_object_or_404(Game, id=game_id)
    serializer = GameSerializer(game)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_game(request, game_id):
    # Fetch the game instance
    game = get_object_or_404(Game, id=game_id)

    # Get the current user from the request (assuming 'player2' is an ID)
    current_user_id = request.data.get('player2')
    print(current_user_id)
    print(game.player1)

    if current_user_id:
        try:
            current_user = CustomUser.objects.get(id=current_user_id)
        except CustomUser.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
        # Check if the current user is player1
        if game.player1 == current_user:
            # Return the game as is, no update allowed
            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'player2 ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update the game if the current user is not player1
    serializer = GameSerializer(game, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_games(request):
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_game(request, game_id):
    # Fetch the game instance
    game = get_object_or_404(Game, id=game_id)
    
    # print(request.user)
    # # Check if the current user is either player1 or player2
    # if game.player1 != request.user:
    #     return Response({'message': 'You do not have permission to delete this game.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Delete the game
    game.delete()
    return Response({'message': 'Game deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
