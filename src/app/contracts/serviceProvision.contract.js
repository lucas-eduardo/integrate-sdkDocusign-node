import * as Yup from 'yup';
import Docusign from 'docusign-esign';

const templateId = 'e3fa7d3f-da08-44c1-aa27-78c8fd0179da';

const signer = {
  email: '',
  name: '',
  roleName: 'client',
  tabs: {},
};

const textTabsContractor = [
  { tabLabel: '\\*nameContractor', value: '' },
  { tabLabel: 'nationalityContractor', value: '' },
  { tabLabel: 'maritalStatusContractor', value: '' },
  { tabLabel: 'professionContractor', value: '' },
  { tabLabel: 'rgContractor', value: '' },
  { tabLabel: 'cpfContractor', value: '' },
  { tabLabel: 'streetContractor', value: '' },
  { tabLabel: 'numberContractor', value: '' },
  { tabLabel: 'neighborhoodContractor', value: '' },
  { tabLabel: 'zipCodeContractor', value: '' },
  { tabLabel: 'cityContractor', value: '' },
  { tabLabel: 'stateContractor', value: '' },
];

const textTabsHired = [
  { tabLabel: '\\*nameHired', value: '' },
  { tabLabel: 'nationalityHired', value: '' },
  { tabLabel: 'maritalStatusHired', value: '' },
  { tabLabel: 'professionHired', value: '' },
  { tabLabel: 'rgHired', value: '' },
  { tabLabel: 'cpfHired', value: '' },
  { tabLabel: 'streetHired', value: '' },
  { tabLabel: 'numberHired', value: '' },
  { tabLabel: 'neighborhoodHired', value: '' },
  { tabLabel: 'zipCodeHired', value: '' },
  { tabLabel: 'cityHired', value: '' },
  { tabLabel: 'stateHired', value: '' },
];

const textTabsService = [
  { tabLabel: 'services', value: '' },
  { tabLabel: 'value', value: '' },
  { tabLabel: 'describedValue', value: '' },
  { tabLabel: 'place', value: '' },
  { tabLabel: 'date', value: '' },
  { tabLabel: 'year', value: '' },
];

class ServiceProvisionContract {
  constructor({ response, email, name, fields }) {
    return new Promise(resolve => {
      (async () => {
        try {
          this.envelopeDefinition = new Docusign.EnvelopeDefinition();

          this.textTabs = [];
          this.signer = signer;

          await this.validateFields(fields);
          this.setSigner({ email, name });
          this.setFieldsContractor(fields.fieldsContractor);
          this.setFieldsHired(fields.fieldsHired);
          this.setFieldsService(fields.fieldsService);

          this.envelopeDefinition.templateRoles = this.templateRole(
            this.textTabs
          );
          this.envelopeDefinition.templateId = templateId;
          this.envelopeDefinition.status = 'sent';

          return resolve(this.envelopeDefinition);
        } catch (error) {
          return response
            .status(400)
            .json({ error: 'Validation fails', messages: error.inner });
        }
      })();
    });
  }

  async validateFields(fields) {
    try {
      const schema = Yup.object()
        .shape({
          fieldsContractor: Yup.object()
            .shape({
              contractor: Yup.string().required(),
              nationalityContractor: Yup.string().required(),
              maritalStatusContractor: Yup.string().required(),
              professionContractor: Yup.string().required(),
              rgContractor: Yup.number().required(),
              cpfContractor: Yup.number().required(),
              streetContractor: Yup.string().required(),
              numberContractor: Yup.number().required(),
              neighborhoodContractor: Yup.string().required(),
              zipCodeContractor: Yup.string().required(),
              cityContractor: Yup.string().required(),
              stateContractor: Yup.string().required(),
            })
            .required(),
          fieldsHired: Yup.object()
            .shape({
              hired: Yup.string().required(),
              nationalityHired: Yup.string().required(),
              maritalStatusHired: Yup.string().required(),
              professionHired: Yup.string().required(),
              rgHired: Yup.number().required(),
              cpfHired: Yup.number().required(),
              streetHired: Yup.string().required(),
              numberHired: Yup.number().required(),
              neighborhoodHired: Yup.string().required(),
              zipCodeHired: Yup.string().required(),
              cityHired: Yup.string().required(),
              stateHired: Yup.string().required(),
            })
            .required(),
          fieldsService: Yup.object()
            .shape({
              services: Yup.string().required(),
              value: Yup.string().required(),
              describedValue: Yup.string().required(),
              place: Yup.string().required(),
              date: Yup.string().required(),
              year: Yup.number().required(),
            })
            .required(),
        })
        .required();
      await schema.validate(fields, { abortEarly: false });
    } catch (error) {
      throw new Error(error.inner);
    }
  }

  setSigner({ email, name }) {
    this.signer = { ...signer, email, name };
  }

  setFieldsContractor(fields) {
    const textTabsValueContractor = textTabsContractor.map(item => {
      if (!fields[item.tabLabel]) {
        item.value = fields.contractor;
        return item;
      }

      item.value = fields[item.tabLabel];
      return item;
    });

    this.textTabs = textTabsValueContractor;
  }

  setFieldsHired(fields) {
    const textTabsValueHired = textTabsHired.map(item => {
      if (!fields[item.tabLabel]) {
        item.value = fields.hired;
        return item;
      }

      item.value = fields[item.tabLabel];
      return item;
    });

    this.textTabs = [...this.textTabs, ...textTabsValueHired];
  }

  setFieldsService(fields) {
    const textTabsValueService = textTabsService.map(item => {
      item.value = fields[item.tabLabel];
      return item;
    });

    this.textTabs = [...this.textTabs, ...textTabsValueService];
  }

  templateRole(textTabs) {
    const definition = { ...this.signer, tabs: { textTabs } };
    const docusignTemplateRole = Docusign.TemplateRole.constructFromObject(
      definition
    );
    return [docusignTemplateRole];
  }
}

export default ServiceProvisionContract;
