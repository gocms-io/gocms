# Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
# except in compliance with the License. A copy of the License is located at
#
#     http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is distributed on an "AS IS"
# BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under the License.
"""
A Bitbucket Builds template for deploying
an application to AWS Elastic Beanstalk
joshcb@amazon.com
v1.0.0
"""
from __future__ import print_function
import os
import sys
from time import strftime, sleep
import boto3
from botocore.exceptions import ClientError

VERSION_LABEL = os.getenv('BITBUCKET_COMMIT')
BUCKET_KEY = os.getenv('APPLICATION_NAME') + '/' + VERSION_LABEL + \
    '-bitbucket_builds.zip'

def upload_to_s3(artifact):
    """
    Uploads an artifact to Amazon S3
    """
    try:
        client = boto3.client('s3')
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        client.put_object(
            Body=open(artifact, 'rb'),
            Bucket=os.getenv('S3_BUCKET'),
            Key=BUCKET_KEY
        )
    except ClientError as err:
        print("Failed to upload artifact to S3.\n" + str(err))
        return False
    except IOError as err:
        print("Failed to access artifact.zip in this directory.\n" + str(err))
        return False

    return True

def create_new_version():
    """
    Creates a new application version in AWS Elastic Beanstalk
    """
    try:
        client = boto3.client('elasticbeanstalk')
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        response = client.create_application_version(
            ApplicationName=os.getenv('APPLICATION_NAME'),
            VersionLabel=VERSION_LABEL,
            Description='New build from Bitbucket',
            SourceBundle={
                'S3Bucket': os.getenv('S3_BUCKET'),
                'S3Key': BUCKET_KEY
            },
            Process=True
        )
    except ClientError as err:
        print("Failed to create application version.\n" + str(err))
        return False

    try:
        if response['ResponseMetadata']['HTTPStatusCode'] is 200:
            return True
        else:
            print(response)
            return False
    except (KeyError, TypeError) as err:
        print(str(err))
        return False

def deploy_new_version():
    """
    Deploy a new version to AWS Elastic Beanstalk
    """
    try:
        client = boto3.client('elasticbeanstalk')
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        response = client.update_environment(
            ApplicationName=os.getenv('APPLICATION_NAME'),
            EnvironmentName=os.getenv('APPLICATION_ENVIRONMENT'),
            VersionLabel=VERSION_LABEL,
        )
    except ClientError as err:
        print("Failed to update environment.\n" + str(err))
        return False

    print(response)
    return True

def main():
    " Your favorite wrapper's favorite wrapper "
    if not upload_to_s3('/tmp/artifact.zip'):
        sys.exit(1)
    if not create_new_version():
        sys.exit(1)
    # Wait for the new version to be consistent before deploying
    #sleep(5)
    #if not deploy_new_version():
        #   sys.exit(1)

if __name__ == "__main__":
    main()
