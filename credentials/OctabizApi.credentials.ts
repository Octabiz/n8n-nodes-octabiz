// ABOUTME: n8n credential for Octabiz — an oc_live_ API key sent as a bearer
// ABOUTME: token, tested against GET /v1/me so n8n can confirm the key works.

import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OctabizApi implements ICredentialType {
  name = 'octabizApi';

  displayName = 'Octabiz API';

  icon: Icon = 'file:octabiz.svg';

  documentationUrl = 'https://api.octabiz.ai/functions/v1/connect-api/v1/openapi.json';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Create one in Octabiz under Settings > API keys (starts with oc_live_).',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.octabiz.ai/functions/v1/connect-api/v1',
      description: 'Advanced. Only change for a test or self-hosted Octabiz.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/me',
    },
  };
}
