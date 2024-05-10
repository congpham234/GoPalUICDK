import { Stack, StackProps } from 'aws-cdk-lib';
import { IVpc, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { SERVICE_NAME } from '../config/constants';

export class VpcStack extends Stack {
  public readonly vpc: IVpc;
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.vpc = new Vpc(this, `${SERVICE_NAME}Vpc`, {
      natGateways: 0,
    });
  }
}
