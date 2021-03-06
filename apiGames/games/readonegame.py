import json
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')

    id = event['pathParameters']['id']
    key = {
        'id': id
    }
    result = table.get_item(Key=key)
    item = result.get('Item', {})
    body = {
        'item': item
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

