import json
import boto3

def handler(event, context):
    game = json.loads(event['body'])

    key = {
        "id": game['id']
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')
    result = table.delete_item(Key=key)

    body = {
        "message": "delete",
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