import {
  fromUnixTime,
  addDays,
  addMonths,
  formatISO,
  startOfHour,
  endOfHour,
} from 'date-fns';
import instanceApi from '../libs/docusignInstanceApi.lib';
import contracts from '../contracts';
import dateHelper from '../helpers/date.helper';

class EnvelopeController {
  async index(req, res) {
    const {
      status,
      search,
      periodMonth,
      periodDay,
      periodHour,
      customDate,
    } = req.query;
    const envelopesApi = await instanceApi({ api: 'EnvelopesApi' });

    const filter = {
      userId: process.env.USER_ID,
    };

    let fromDate;
    let toDate;

    if (periodMonth) {
      const dateCurrent = new Date();
      fromDate = dateHelper.periodMonth({ period: periodMonth, dateCurrent });
      toDate = formatISO(endOfHour(dateCurrent));
    } else if (periodDay) {
      const dateCurrent = new Date();
      fromDate = dateHelper.periodDay({ period: periodDay, dateCurrent });
      toDate = formatISO(endOfHour(dateCurrent));
    } else if (periodHour) {
      const dateCurrent = new Date();
      fromDate = dateHelper.periodHour({ period: periodHour, dateCurrent });
      toDate = formatISO(endOfHour(dateCurrent));
    } else if (customDate) {
      const [start, end] = customDate.split(';');
      if (fromUnixTime(start) >= fromUnixTime(end)) {
        return res.status(400).json({ error: 'Incorrect date range' });
      }

      fromDate = startOfHour(fromUnixTime(start));
      toDate = endOfHour(fromUnixTime(end));
    } else {
      const date = new Date();
      fromDate = startOfHour(addMonths(date, -6));
      toDate = endOfHour(addDays(date, 1));
    }

    if (search) {
      fromDate = startOfHour(new Date('2003-01-01'));
      filter.searchText = search;
    }

    filter.fromDate = fromDate;
    filter.toDate = toDate;
    filter.status = status || '';

    const result = await envelopesApi.listStatusChanges(
      process.env.ACCOUNT_ID,
      filter
    );

    return res.json(result);
  }

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
