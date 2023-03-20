import { getAxiosInstance } from './axios';

describe('axios', () => {
  it('should work', () => {
    expect(getAxiosInstance()).toEqual('axios');
  });
});
