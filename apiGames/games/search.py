import json
import boto3
from boto3.dynamodb.conditions import Key

# Perform a query in games table with input parameters
def handler(event, context):
    game = json.loads(event['body'])
    search = {
        "id":game['id'],
        "title":game['title'],
        "players":game['players'],
        "ordercolumn":game['ordercolumn']
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')
    result = table.scan()

    items = result.get('Items', [])

    # Now filter the items
    if items:
        if search['id']:
            items = [d for d in items if d['id'] == search['id']]
        if search['title']:
            items = [d for d in items if d['title'] == search['title']]
        if search['players']:
            items = [d for d in items if d['players'] == search['players']]
        if search['ordercolumn']:
            def getColumn(e):
                return e[search['ordercolumn']]
            items.sort(key=getColumn)

    body = {
        'items': items
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

