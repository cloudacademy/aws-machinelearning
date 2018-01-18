#!/bin/bash
#script designed to run on macos
#author: jeremy.cook@cloudacademy.com

read MESSAGE

TO="EMAIL_TO_ADDRESS_HERE"
FROM="EMAIL_FROM_ADDRESS_HERE"
ACCESS_KEY="AWS_ACCESS_KEY_HERE"
SECRET_KEY="AWS_SECRET_KEY_HERE"

SUBJECT="Feature DETECTED!!"
SES_API_ENDPOINT_URL="https://email.us-east-1.amazonaws.com/"

if [ -n "$MESSAGE" ]; then
    date="$(date +"%a, %d %b %Y %H:%M:%S %Z")"
    signature="$(echo -n "$date" | openssl dgst -sha256 -hmac "$SECRET_KEY" -binary | base64 -b 0)"
    auth_header="X-Amzn-Authorization: AWS3-HTTPS AWSAccessKeyId=$ACCESS_KEY, Algorithm=HmacSHA256, Signature=$signature"
    action="Action=SendEmail"
    source="Source=$FROM"
    to="Destination.ToAddresses.member.1=$TO"
    subject="Message.Subject.Data=$SUBJECT"
    message="Message.Body.Text.Data=$MESSAGE"

    curl -v -X POST -H "Date: $date" -H "$auth_header" --data-urlencode "$message" --data-urlencode "$to" --data-urlencode "$source" --data-urlencode "$action" --data-urlencode "$subject"  "$SES_API_ENDPOINT_URL"
fi

echo fin!
