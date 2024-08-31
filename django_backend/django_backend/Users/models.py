from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class CustomUser(AbstractUser):
    email = models.CharField(max_length=255, unique=True, blank=False, null=False)
    country = models.CharField(max_length=100)
    skill = models.CharField(max_length=100)


class Game(models.Model):
    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='red_player', on_delete=models.SET_NULL, null=True, blank=True)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='black_player', on_delete=models.SET_NULL, null=True, blank=True)
    fen = models.CharField(max_length=500)
    moves = models.TextField(blank=True, default='')  

    def __str__(self):
        return f"Game {self.id} - {self.fen}"

