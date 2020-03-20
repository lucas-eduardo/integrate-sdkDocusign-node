import Docusign from 'docusign-esign';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default async () => {
  const apiClient = new Docusign.ApiClient();
  const pathPrivateKey = resolve(__dirname, '..', '..', 'key', 'private.pem');

  if (process.env.NODE_ENV !== 'production') {
    apiClient.addDefaultHeader('Authorization', `Bearer ${process.env.TOKEN}`);
  } else {
    apiClient.setOAuthBasePath(process.env.AUTH_SERVER);
    const private_key = readFileSync(pathPrivateKey, 'utf8');

    const { body } = await apiClient.requestJWTUserToken(
      process.env.INTEGRATION_KEY,
      process.env.USER_ID,
      process.env.SCOPE,
      private_key,
      3600
    );

    apiClient.addDefaultHeader('Authorization', `Bearer ${body.access_token}`);
  }

  apiClient.setBasePath(process.env.BASE_URL);
  apiClient.addDefaultHeader('X-DocuSign-Authentication', {
    Username: process.env.USERNAME,
    Password: process.env.PASSWORD,
    IntegratorKey: process.env.INTEGRATION_KEY,
  });

  return apiClient;
};
