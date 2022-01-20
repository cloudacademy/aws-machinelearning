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

# Deploying the web app

## Update the web app
Once the three variables in script.js are set.  Zip the code and upload.

```
~/aws-machinelearning/rekognition/demo-sdk$ zip -r web.zip .
```
## Create a static web page 

1. Click the 'aws' icon in top left
2. Scroll down to `Build a solution` tile at bottom of page 
3. Click the `Host a static web ` with AWS Amplify Console.  
> Note the video refers to a entry no longer listed.  If you search you will find
[this](https://aws.amazon.com/getting-started/hands-on/host-static-website/) but even 
it is in aws Amplify.

4. Click "Deploy without git provider"
5. Give name "CloudAcademyRekognitionWebApp"
6. upload the `web.zip` created earlier.
7. Note the Domain, in this case `https://test.d360yg3fm3vqo1.amplifyapp.com/`

There is probably a way within amplify to do this but lets entry
to proceed with the Route53 method shown in the video.

## Route 53

1. Go to hosted zone in Route53. In my case its rtp-aws.org 
2. Click create new record
3. give it a name. `acrekognition.rtp-aws.org`
4. Switch record type to `CNAME`
5. Enter for value, the domain listed above. `test.d360yg3fm3vqo1.amplifyapp.com`
6. click create button.

> Hmm. I have *.rtp-aws.org listed in my route53 but it does not work. 

Perhaps because I did not perform the validation CNAME record step.  See video at 
`11:00` mark.  Interesting it says to delete the existing CNAME record.  I wonder
if I could do that for rtp-aws.org.  I added one when I put the website up
initially.

I did add `acrekognition.rtp-aws.org` to my existing `Alternate domain name (CNAME)`
in CloudFront in the `Edit Distributions` form.

Eventually this worked, but it redirected to my existing rtp-aws.org website.





