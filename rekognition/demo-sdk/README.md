# Associated course

This code is discussed [here](https://cloudacademy.com/course/amazon-rekognition/demonstration-facial-analysis-web-app/).

# Setup aws S3 bucket

Used to store uploaded photos (images) from the user's (browsers) web cam.

The name and region will be used in the `script.js` code.

# Setup aws cognito

Used to get access to aws resources.

The IdentityPoolId setup below will also be used in the `script.js` code.

> Amazon Cognito provides solutions to control access to AWS resources from your app.

The service is found under 'Security, Identify, & Compliance'


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

NOTE: At this point, the video shows how to host a static web app using quick start, but it is no longer
on the aws console.  Instead it has been replaced with AWS Amplify.  These instructions partially conver th
method in the video for Setting up Route 53, S3, CloudFront, but the video does not cover how to specify
the updated method for the differences between Amplify Apps and Elastic Beanstalk apps.

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

# Static Website Hosting with AWS

This is a third revision on the notes to host
a website with aws.



# S3 hosted method

S3 bucket storage will host the website contents.

## Create bucket

These are the steps for S3.

1. create bucket name rtp-aws.org
2. use region us-east-1 
3. use the default acls
4. disable the block all public access checkboxes.
5. click create bucket.
6. select the bucket to edit.
7. click properties. select static website hosting.
8. specify index.html as homepage.
9. click save changes.
10. Click permissions

remove all block public access if not done by now

11. Edit policy

Using this guide, https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html

Grab the sample policy and edit bucket name to be `rtp-aws.org/*`

## Route 53 and register.com - Part 1

Register.com will still own the domain, but 
will use the DNS servers provided by Route 53

1. click services->Route 53
2. click dns managment->create hosted zone
3. enter domain name `rtp-aws.org`
4. click `public hosted zone`
5. for each of the four dns servers, add them as custom domains in register.com as custom name servers. >NOTE: omit the final dot for the name.




## CloudFront - part 1

CloudFront is a content delivery network

Go to cloudfront for the content delivery network. 

1. Click distribution
2. Scroll down to "Request Certificate".  Click that and Certificate Manager opens.

### Certificate Manager

1. click request public certificate.
2. for domain name add `*.rtp-aws.org` This is for all hosts in this domain.
3. add another name add `rtp-aws.org.  This is considered an apex domain name.
4. select validation method.  Choose DNS validation.
5. click request


At this point you need to wait for them to complete validation.  
The `apex domain name` rtp-aws.org will validate rather quickly.  The
`*.rtp-aws.org` domain will require an email from register.com
to be confirmed.

Wait until Cloud Front says the *.rtp-aws.org certificate is issued.

Click the `Create records in Route 53`

## route 53 - part 2

In route 53, select the `rtp-aws.org` zone we created earlier.

Verify CNAME record is there.  I am not certain if you need to wait 
for both domains to be valid before you will do this again.  As it is 
now I only have one CNAME record in Route 53.  TODO: revisit this
later to see if we can add a second.


## Cloud Front - part 2



In first edit box for `origin domain` select rtp-aws.org.s3.us-east-1.amazonaws.com`

Origin Name will auto populate.  Leave blank the origin path edit box.

In `Default cache behavior->Viewer` select the radio button for `Redirect HTTP to HTTPS`



* `Alternate domain names (CNAME)` add items for:
    * `www.rtp-aws.org` This is for website
    * `rtp-aws.org` This is also for website
    * `testy-aws.org` Perhaps this is needed for the first web app
* `Custom SSL certificate` use the pull down to select the `*.rtp-aws.org (some letters)` for the cert.  NOTE: This is the wildcard certificate.
* In `Settings` at bottom, for the `Default root object` add `index.html`
* click `create distribution`

On the details of the `Distribution domain name` there is a fqdn for the 
cloudfront host.  It says `d2tobmfzz3j5.cloudfront.net` that entry needs
to be used in route53 to create an A record.  Once that is done, at least the
route53 dns server resolves to the proper ip address.

NOTE: Regarding webapps.  For AWS Amplify, you do not want an entry in cloudfront.  For AWS 
Elastic Beanstalk you do want an entry.


## route 53 - part 3

After you have copied the `Distribution domain name` value from the Cloud Front Distribution,
go back to Route 53.

* Click Create Record
* For record name, enter `www` with rtp-aws.org already specified
* For record type, specify `A`
* For Route Traffic to setting
    * Click the slide to `Alias`
    * Click pulldown to `Alias to CloudFront distribution`
    * In the search box look for the distribution which you copied, or just copy.
        > I waited long enough that it was present in the pulldown.

Do this for two of the domains you added in cloud front
* blank
* wwww

For an app, do everything the same but instead of `CloudFront distribution`,
select `Elastic Beanstalk`.  Then choose which domain you want to use.

* testy

It also looks like when you go back to the certificate manager it has resolved 
how to do the second certificate.  I thought two CNAME records would be added.
That is not the case.  Even after waiting when you go back, it will have
both certs grayed out, and it will say CNAME record is in Route 53.


### Special Notes on Web Apps

## Elastik Beanstalk

* Create an entry in Cloud Front
* Create an entry in Route 53 which points to elastic beanstalk where the hostname
matches what is in Cloud Front

## Amplify

* Use Amplify to manage the domain.  It will create a cloud front distribution
and a Route 53 entry for you.  since we are hosting the website already with S3/Route53/Cloudfront
only specify the app name in the Domain DNS entry.  Remove the default hostnames.

### Baby Steps

* In Amplify
* Click `Domain Management` in left side bar
* Click `Add Domain`
* Enter domain `rtp-aws.org`
* Click `Configure Domain`
* Click `Exclude Root`, this takes out https://rtp-aws.org
* Click `Remove`, this takes out https://www.rtp-aws.org
* Click `Add`, `rek-face` and the test app name is only one given.
* Click `Save`.  This brings up the bar graph.  Just wait for it to complete.





