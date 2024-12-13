import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from Users.models import Game  # Make sure Django setup is called before importing models

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.gameid = self.scope['url_route']['kwargs']['gameid']
        self.room_group_name = f'game_{self.gameid}'
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        logger.info(f'WebSocket connected to game: {self.gameid}')

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f'WebSocket disconnected from game: {self.gameid} with close code: {close_code}')

    async def receive(self, text_data):
        logger.info(text_data)

        if not text_data:
            await self.send(text_data=json.dumps({
                'error': 'Empty data received'
            }))
            return

        try:
            # Parse the incoming JSON data
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', '')
            
            if message_type == 'move':
                # Handle move
                game = Game.objects.get(id=self.gameid)
                move_data = text_data_json.get('move')
                
                # Process move, update the game state, and broadcast to other players
                game.process_move(move_data)
                updated_board = game.get_board_state()  # Implement this method
                updated_fen = game.get_FEN()  # Implement this method
                
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_update',
                        'boardUpdate': updated_board,
                        'FEN': updated_fen
                    }
                )
            
            elif message_type == 'game_over':
                result = text_data_json.get('result')
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_over',
                        'result': result
                    }
                )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON data received'
            }))

    async def game_update(self, event):
        board_update = event['boardUpdate']
        fen = event['FEN']
        
        await self.send(text_data=json.dumps({
            'type': 'move',
            'boardUpdate': board_update,
            'FEN': fen
        }))
    
    async def game_over(self, event):
        result = event['result']
        
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'result': result
        }))
