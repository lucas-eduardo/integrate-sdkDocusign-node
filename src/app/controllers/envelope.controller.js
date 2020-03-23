import instanceApi from '../libs/docusignInstanceApi.lib';
import contracts from '../contracts';

class EnvelopeController {
  async store(req, res) {
    const envelopesApi = await instanceApi({ api: 'EnvelopesApi' });

    const { contract, email, name, fields } = req.body;

    const obj = { response: res, email, name, fields };

    const envelopeDefinition = await new contracts[contract](obj);

    const result = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
      envelopeDefinition,
    });

    return res.json(result);
  }
}

export default new EnvelopeController();
