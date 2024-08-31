from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from django_backend.consumers import GameConsumer
application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('ws/game/', GameConsumer.as_asgi()),
    ])
})