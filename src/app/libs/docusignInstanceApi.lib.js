import Docusign from 'docusign-esign';

import docusignClient from './docusignClient.lib';

export default async ({ api }) => {
  const apiClient = await docusignClient();
  Docusign.Configuration.default.setDefaultApiClient(apiClient);

  return new Docusign[api]();
};
