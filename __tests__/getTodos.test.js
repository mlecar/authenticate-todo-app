import handler from '../pages/api/getTodos';
import auth0 from '../pages/api/utils/auth0';
import { table, minifyRecords } from '../pages/api/utils/Airtable';

jest.mock('../pages/api/utils/auth0');
jest.mock('../pages/api/utils/Airtable');

const mockReq = {};
const createRes = () => ({ statusCode: 0, json: jest.fn() });

describe('getTodos API', () => {
  beforeEach(() => {
    auth0.requireAuthentication.mockImplementation(fn => fn);
    auth0.getSession.mockResolvedValue({ user: { sub: 'user1' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns todos for authenticated user', async () => {
    const records = [{ id: '1', fields: { title: 'Test' } }];
    const minified = [{ id: '1', fields: { title: 'Test' } }];
    table.select.mockReturnValue({ firstPage: jest.fn().mockResolvedValue(records) });
    minifyRecords.mockReturnValue(minified);

    const res = createRes();
    await handler(mockReq, res);

    expect(table.select).toHaveBeenCalledWith({ filterByFormula: "user_id = 'user1'" });
    expect(res.statusCode).toBe(200);
    expect(res.json).toHaveBeenCalledWith(minified);
  });

  it('handles errors from Airtable', async () => {
    table.select.mockReturnValue({ firstPage: jest.fn().mockRejectedValue(new Error('bad')) });
    const res = createRes();
    await handler(mockReq, res);

    expect(res.statusCode).toBe(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong' });
  });
});
