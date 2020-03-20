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
  constructor({ email, name, fieldsContractor, fieldsHired, fieldsService }) {
    this.envelopeDefinition = new Docusign.EnvelopeDefinition();

    this.textTabs = [];
    this.signer = signer;

    this.setSigner({ email, name });
    this.setFieldsContractor(fieldsContractor);
    this.setFieldsHired(fieldsHired);
    this.setFieldsService(fieldsService);

    this.envelopeDefinition.templateRoles = this.templateRole(this.textTabs);
    this.envelopeDefinition.templateId = templateId;
    this.envelopeDefinition.status = 'sent';
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
