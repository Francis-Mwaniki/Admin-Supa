import dayjs from 'dayjs';
// import { PrismaClient } from '@prisma/client';
import {
  AccountBalanceQueryConfig,
  AuthResponse,
  B2CTransactionConfig,
  ClientConfig,
  STKQuery,
  UrlRegisterConfig,
} from "../../intefaces/index";
import axios, { AxiosInstance } from 'axios';

export default defineEventHandler(async (event) => {
  // const prisma = new PrismaClient();


  const config: ClientConfig = {
    environment: 'sandbox', // Specify 'production' or 'sandbox'
    consumerKey: 'BNWUzOA1b7M4H64wNdwiuK17NJtDKGcF',
    consumerSecret: 'wgzBRQHmFvPgRanV',
    passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    shortCode: '600977',
  };

  const mpesa = new Mpesa(config);
  await mpesa.getAccessToken();

  try {
    // Perform your operations here
    // Example:
    const registerParams: UrlRegisterConfig = {
      ShortCode: '600977',
      ResponseType: 'Completed',
      ConfirmationURL: 'https://565c-102-68-79-143.ap.ngrok.io/confirmation',
      ValidationURL: 'https://565c-102-68-79-143.ap.ngrok.io/validation'
    };
    const response = await mpesa.registerUrls(registerParams);
    console.log(response);

    const balanceQuery: AccountBalanceQueryConfig = {
      PartyA: 600977,
      Remarks: '',
      Initiator: 'testapi',
      SecurityCredential:"L1zI+Cjt/3NFWzTMKfNNzfsGndbJutIKXn4nPiR8h+4L1/h46GMXA1tE47pmBk6LXZ6p0U0OqkC0wld5t5PeI3AlMASEGqIVm3y2S8omIZS4YB7+iMpx36Y3iDXis3K/sB4foflrOigj+EOF3bvQ2WgQnijueGR8daB2vPkHw77/58VWMiAsbnFjlte6xFIBol7LQ8ketU5N8TXkI19d28MY5w+o5yjK/iyIKLt7tm7Z1lprWZDQDnk9bzygxHqtLMM1XpijOKQFVLuI0RTvcPR+fIqmB6cbU4s5KMFlE/pHJW4wUbXB934j1InkM0ZNeTH3LzMZu+uk2PV33c7+rQ==",
      QueueTimeOutURL: "https://565c-102-68-79-143.ap.ngrok.io/timeout_url",
      ResultURL: "https://565c-102-68-79-143.ap.ngrok.io/result_url"
    };
    const balance = await mpesa.getAccountBalance(balanceQuery);
    console.log(balance);

    const b2cTransaction: B2CTransactionConfig = {
      InitiatorName: '',
      SecurityCredential: '',
      CommandID: '',
      Amount: '',
      PartyA: '',
      PartyB: '',
      Remarks: '',
      QueueTimeOutURL: '',
      ResultURL: '',
      Occassion: ''
    };
    const b2cResponse = await mpesa.B2C(b2cTransaction);
    console.log(b2cResponse);

    const stkQuery: STKQuery = {
      amount: 0,
      sender: '254746032247',
      reference: 'CompanyXLTD',
      callbackUrl: "https://565c-102-68-79-143.ap.ngrok.io/callback",
      description: 'Payment of X'
    };
    const stkResponse = await mpesa.sendSTKPush(stkQuery);
    console.log(stkResponse);
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' }),
  };
});



export class Mpesa {
  private readonly config: ClientConfig;
  private readonly BASE_URL: string;
  private token: string | undefined;
  private readonly axiosInstance: AxiosInstance;

  constructor(configs: ClientConfig) {
    this.config = configs;
    this.BASE_URL =
      configs.environment !== 'production'
        ? 'https://sandbox.safaricom.co.ke'
        : 'https://api.safaricom.co.ke';
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        Authorization: '',
      },
    });
  }

  async getAccessToken(): Promise<AuthResponse> {
    const req = await this.axiosInstance.get(
      '/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${this.config.consumerKey}:${this.config.consumerSecret}`
            ).toString('base64'),
        },
      }
    );
    const { access_token } = req.data;
    this.token = access_token;
    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    return req.data;
  }

  async registerUrls(registerParams: UrlRegisterConfig) {
    const req = await this.axiosInstance.post(
      '/mpesa/c2b/v2/registerurl',
      registerParams
    );
    return req.data;
  }

  async B2C(b2cTransaction: B2CTransactionConfig) {
    const req = await this.axiosInstance.post(
      '/mpesa/b2c/v1/paymentrequest',
      b2cTransaction
    );
    return req.data;
  }

  async getAccountBalance(balanceQuery: AccountBalanceQueryConfig) {
    const req = await this.axiosInstance.post(
      '/mpesa/accountbalance/v1/query',
      balanceQuery
    );
    if (req.status === 200) {
      return req.data;
    }
    throw new Error('Failed to get account balance');
  }

  async sendSTKPush(stkQuery: STKQuery) {
    const { amount, sender, callbackUrl, reference, description } = stkQuery;
    const now = Date.now();
    const timestamp = dayjs(now).format('YYYYMMDDHHmmss');
    const passkey = this.config.passKey;
    const password = Buffer.from(
      `${this.config.shortCode}${passkey}${timestamp}`
    ).toString('base64');
    const request = await this.axiosInstance.post('/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: this.config.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: sender,
      PartyB: this.config.shortCode,
      PhoneNumber: sender,
      CallBackURL: callbackUrl,
      AccountReference: reference,
      TransactionDesc: description,
    });
    if (request.status === 200) {
      return request.data;
    }
    throw new Error('Failed to send STK push');
  }

  // Add other methods as needed
  // ...
}
