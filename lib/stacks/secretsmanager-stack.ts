import { Stack, StackProps } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface SecretsManagerStackProps extends StackProps {
  readonly serviceRole: IRole;
}

export class SecretsManagerStack extends Stack {
  readonly bookingDotCom: Secret;
  readonly openAiApiKey: Secret;

  constructor(scope: Construct, id: string, props: SecretsManagerStackProps) {
    super(scope, id, props);

    // Create a new secret or reference an existing one
    this.bookingDotCom = new Secret(this, 'BookingDotComAPIKeyId', {
      secretName: 'BookingDotComAPIKey',
      // You can provide an initial value or let it be auto-generated
      description: 'This is a secret for booking dot com Rapid API.',
    });

    this.openAiApiKey = new Secret(this, 'OpenAiAPIKeyId', {
      secretName: 'OpenAiAPIKeyId',
      // You can provide an initial value or let it be auto-generated
      description: 'This is a secret for OpenAi API key.',
    });

    this.bookingDotCom.grantRead(props.serviceRole);
    this.openAiApiKey.grantRead(props.serviceRole);
  }
}
