import request from 'supertest';
import faker from 'faker/locale/pt_BR';

import app from '../../src/app';

jest.mock('../../src/app/libs/docusignInstanceApi.lib', () => {
  return jest.fn().mockReturnValue({
    createEnvelope: jest.fn().mockReturnValue({
      envelopeId: '337573bc-56fe-49a3-9915-ea4998bf9d0a',
      status: 'sent',
      statusDateTime: '2020-03-23T00:54:06.3454913Z',
      uri: '/envelopes/337573bc-56fe-49a3-9915-ea4998bf9d0a',
    }),
    listStatusChanges: jest.fn().mockReturnValue({
      envelopes: [],
    }),
  });
});

describe('Envelope', () => {
  describe('Store', () => {
    it('performing the contract submission', async () => {
      const dataUser = {
        contract: 'contract-serviceProvision',
        name: faker.name.findName(),
        email: faker.internet.email(),
        fields: {
          fieldsContractor: {
            contractor: faker.name.findName(),
            nationalityContractor: 'Brasileira',
            maritalStatusContractor: 'Solteira',
            professionContractor: faker.name.jobTitle(),
            rgContractor: 508295762,
            cpfContractor: 34034130040,
            streetContractor: faker.address.streetName(),
            numberContractor: 149,
            neighborhoodContractor: faker.address.streetAddress(),
            zipCodeContractor: faker.address.zipCode(),
            cityContractor: faker.address.city(),
            stateContractor: faker.address.stateAbbr(),
          },
          fieldsHired: {
            hired: faker.name.findName(),
            nationalityHired: 'Brasileiro',
            maritalStatusHired: 'Casado',
            professionHired: faker.name.jobTitle(),
            rgHired: 468011122,
            cpfHired: 99724242781,
            streetHired: faker.address.streetName(),
            numberHired: 468,
            neighborhoodHired: faker.address.streetAddress(),
            zipCodeHired: faker.address.zipCode(),
            cityHired: faker.address.city(),
            stateHired: faker.address.stateAbbr(),
          },
          fieldsService: {
            services: 'Consultoria tecnica.',
            value: '2.500,00',
            describedValue: 'Dois mil e quinhentos reais',
            place: 'Sorocaba',
            date: '19 de Março',
            year: 2020,
          },
        },
      };

      const { body, status } = await request(app)
        .post('/envelope')
        .send(dataUser);

      expect(status).toBe(200);
      expect(body).toHaveProperty('envelopeId');
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('statusDateTime');
      expect(body).toHaveProperty('uri');
    });

    it('failing to pass any field of the contract, and not allowing the envelope to be sent', async () => {
      const dataUser = {
        contract: 'contract-serviceProvision',
        name: faker.name.findName(),
        email: faker.internet.email(),
        fields: {
          fieldsContractor: {
            nationalityContractor: 'Brasileira',
            maritalStatusContractor: 'Solteira',
            professionContractor: faker.name.jobTitle(),
            rgContractor: 508295762,
            cpfContractor: 34034130040,
            streetContractor: faker.address.streetName(),
            numberContractor: 149,
            neighborhoodContractor: faker.address.streetAddress(),
            zipCodeContractor: faker.address.zipCode(),
            cityContractor: faker.address.city(),
            stateContractor: faker.address.stateAbbr(),
          },
          fieldsHired: {
            hired: faker.name.findName(),
            maritalStatusHired: 'Casado',
            professionHired: faker.name.jobTitle(),
            rgHired: 468011122,
            cpfHired: 99724242781,
            streetHired: faker.address.streetName(),
            numberHired: 468,
            neighborhoodHired: faker.address.streetAddress(),
            zipCodeHired: faker.address.zipCode(),
            cityHired: faker.address.city(),
            stateHired: faker.address.stateAbbr(),
          },
          fieldsService: {
            value: '2.500,00',
            describedValue: 'Dois mil e quinhentos reais',
            place: 'Sorocaba',
            date: '19 de Março',
            year: 2020,
          },
        },
      };

      const { body, status } = await request(app)
        .post('/envelope')
        .send(dataUser);

      expect(status).toBe(400);
      expect(body).toHaveProperty('error');
    });

    it('failing to pass primary information to the envelope, such as name, email and contract, do not allow the envelope to be sent', async () => {
      const dataUser = {
        fields: {
          fieldsContractor: {
            contractor: faker.name.findName(),
            nationalityContractor: 'Brasileira',
            maritalStatusContractor: 'Solteira',
            professionContractor: faker.name.jobTitle(),
            rgContractor: 508295762,
            cpfContractor: 34034130040,
            streetContractor: faker.address.streetName(),
            numberContractor: 149,
            neighborhoodContractor: faker.address.streetAddress(),
            zipCodeContractor: faker.address.zipCode(),
            cityContractor: faker.address.city(),
            stateContractor: faker.address.stateAbbr(),
          },
          fieldsHired: {
            hired: faker.name.findName(),
            nationalityHired: 'Brasileiro',
            maritalStatusHired: 'Casado',
            professionHired: faker.name.jobTitle(),
            rgHired: 468011122,
            cpfHired: 99724242781,
            streetHired: faker.address.streetName(),
            numberHired: 468,
            neighborhoodHired: faker.address.streetAddress(),
            zipCodeHired: faker.address.zipCode(),
            cityHired: faker.address.city(),
            stateHired: faker.address.stateAbbr(),
          },
          fieldsService: {
            services: 'Consultoria tecnica.',
            value: '2.500,00',
            describedValue: 'Dois mil e quinhentos reais',
            place: 'Sorocaba',
            date: '19 de Março',
            year: 2020,
          },
        },
      };

      const { body, status } = await request(app)
        .post('/envelope')
        .send(dataUser);

      expect(status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('Index', () => {
    it('accessing the endpoint, I need to return the docusign envelopes', async () => {
      const { body, status } = await request(app)
        .get('/envelope')
        .send();

      expect(status).toBe(200);
      expect(body).toHaveProperty('envelopes');
    });
  });
});
