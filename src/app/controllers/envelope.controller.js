import Docusign from 'docusign-esign';

import docusignClient from '../libs/docusignClient.lib';

import contracts from '../contracts';

class EnvelopeController {
  async store(req, res) {
    const apiClient = await docusignClient();
    Docusign.Configuration.default.setDefaultApiClient(apiClient);

    const {
      contract,
      email,
      name,
      fieldsContractor,
      fieldsHired,
      fieldsService,
    } = req.body;

    const obj = {
      email,
      name,
      fieldsContractor,
      fieldsHired,
      fieldsService,
    };

    const { envelopeDefinition } = new contracts[contract](obj);

    const envelopesApi = new Docusign.EnvelopesApi();

    const result = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
      envelopeDefinition,
    });

    return res.json(result);
  }
}

export default new EnvelopeController();
