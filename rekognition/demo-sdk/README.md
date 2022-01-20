# Associated course

This code is discussed [here](https://cloudacademy.com/course/amazon-rekognition/demonstration-facial-analysis-web-app/).

# Setup aws S3 bucket

Used to store uploaded photos (images) from the user's (browsers) web cam.

The name and region will be used in the code.

# Setup aws cognito

Used to get access to aws resources

> Amazon Cognito provides solutions to control access to AWS resources from your app.

The service is found under 'Security, Identify, & Compliance'


## setup

1. Click cognito service in aws console
2. Click "Managed Federated Identies" button
3. Enable "Enable access to unauthenticted identities"
4. Click "create pool" button

The next screen has details which show this will setup the following roles for authenticated identities

The Role Name is Cognito_codeacademyrekAuth_Role

The Policy Document is

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```


The next screen has details which show this will setup the following roles for unauthenticated identities

The Role Name is Cognito_codeacademyrekUnauth_Role

The Policy Document is

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}

The difference is in the "cognito-identity" entry.
```


5. Click "Allow" button

This shows the "Getting started with Amazon Cognito" screen.  It has AWS SDKs for various platforms.

6.  Get the "Identity pool ID" in the first stanza identified as "Get AWS Credentials".  Copy the string associated with the comment `// Identity pool ID`

```
"us-east-1:44456c50-199b-4fe8-8ec5-8337b329051b", // Identity pool ID
```

Paste this code in the javascript code script.js for the variable `IdentityPoolId`
