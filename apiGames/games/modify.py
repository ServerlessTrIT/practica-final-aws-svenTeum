import json
import boto3

def handler(event, context):
    # Same as create, but only if the item already exists
    returnStatusCode = 200

    game = json.loads(event['body'])
    item = {
        "id":game['id'],
        "title":game['title'],
        "players":game['players']
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')
    
    gameId = game['id']
    key = {
        'id': gameId
    }
    result = table.get_item(Key=key)
    existingItem = result.get('Item', {})
    if len(existingItem) == 0:
        returnStatusCode = 400
        body = {
            "message": "item does not exist"
        }
    else:
        result = table.put_item(Item=item)
        returnStatusCode = result['ResponseMetadata']['HTTPStatusCode']

        body = {
            "message": "modify",
            "input": game
        }

    response = {
        "statusCode": returnStatusCode,
        'headers': {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'OPTIONS, POST',
        },
        "body": json.dumps(body)
    }

    return response