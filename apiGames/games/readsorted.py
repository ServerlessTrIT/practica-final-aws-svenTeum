import json
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('GamesTable')

    sortColumn = event['pathParameters']['column']
    
    result = table.scan()
    items = result.get('Items', [])
    
    def getColumn(e):
        return e[sortColumn]
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

