#!/usr/bin/bash



# S3 Folder
BUCKET="cloudacademy-rek"
FOLDER="" # The example does not use a folder

# assum
FILE="car.jpg"
FILE_PATH="${RAWDATA_DIR}/${FILE}"

# Combine into a folder/filename QFN
NAME=${FOLDER}/${FILE}

# Build JSON string
# requires `jq` which is used a JSON formatter rather than a decoder.
S3_JSON=$(jq -nc --arg BUCKET "$BUCKET" --arg NAME "$NAME" '{S3Object: {Bucket: $BUCKET, Name:$NAME}}')

# detect on a file in S3
aws rekognition detect-labels --image ${S3_JSON}


# detect on a local file
#aws rekognition detect-labels --image-bytes fileb://${FILE}




