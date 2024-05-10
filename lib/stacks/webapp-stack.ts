import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class WebAppStack extends Stack {
  readonly websiteBucket: Bucket;
  readonly distribution: CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    this.websiteBucket = new Bucket(this, 'GoPalWebsiteBucket', {
      bucketName: 'go-pal-website-bucket',
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create an origin access identity
    const originAccessIdentity = new OriginAccessIdentity(this, 'GoPalOriginAccessIdentity', {
      comment: `OAI for ${id}`,
    });

    // Attach a policy to the bucket that allows CloudFront to access it
    this.websiteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [this.websiteBucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    // Setup CloudFront distribution to serve content from S3
    this.distribution = new CloudFrontWebDistribution(this, 'GoPalWebsiteDistribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: this.websiteBucket,
          originAccessIdentity: originAccessIdentity,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }],
    });

    // Outputs
    new CfnOutput(this, 'BucketURL', { value: this.websiteBucket.bucketWebsiteUrl });
    new CfnOutput(this, 'DistributionID', { value: this.distribution.distributionId });
    new CfnOutput(this, 'DistributionDomainName', { value: this.distribution.distributionDomainName });
  }
}
