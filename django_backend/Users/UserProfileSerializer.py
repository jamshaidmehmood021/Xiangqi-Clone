from rest_framework import serializers
from Users.models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'country', 'skill', 'profile_picture']  # Include profile_picture
        read_only_fields = ['email']  # Email should be read-only to prevent changes
