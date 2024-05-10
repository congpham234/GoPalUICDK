import { App } from 'aws-cdk-lib';
import { SERVICE_NAME } from '../config/constants';
import { WebAppStack } from '../stacks/webapp-stack';

export const createStacks = (app: App, stage: string, region: string) => {
  const stackPrefix = `${stage}-NA-${region}-${SERVICE_NAME}`;

  const webAppStack = new WebAppStack(app, `${stackPrefix}-WebAppStack`);

  return {
    stacks: {
      // vpcStack,
      webAppStack,
    },
  };
};
