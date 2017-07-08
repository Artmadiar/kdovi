This reference describes how to use provided API. Bellow are listed shared conventions.

## Endpoint and URLs

The endpoint address correspond to the base of current URL. To form the complete API URL path use prefix pattern `http://$ENDPOINT/`.

## Schema

All exchanged data is in JSON format. HTTP header `Content-Type: application/json` must be included in requests with body.

## Errors
Besides of declared errors, there might be returned ```{"code":500,"name":"InternalError"}```.
