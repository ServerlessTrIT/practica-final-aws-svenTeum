import json
import boto3

def handler(event, context):
    game = json.loads(event['body'])
    item = {
        "id":game['id'],
        "title":game['title'],
        "players":game['players']
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')
    result = table.put_item(Item=item)

    body = {
        "message": "create",
        "input": game
    }

    response = {
        "statusCode": result['ResponseMetadata']['HTTPStatusCode'],
        'headers': {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'OPTIONS, POST',
        },
        "body": json.dumps(body)
    }

    return response

