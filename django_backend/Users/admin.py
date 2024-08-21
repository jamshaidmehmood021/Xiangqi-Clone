from django.contrib import admin
from Users.models import CustomUser

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'country', 'skill', 'profile_picture')  