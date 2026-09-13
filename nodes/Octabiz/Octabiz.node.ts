// ABOUTME: n8n declarative node for Octabiz. Resources map to Connect REST paths
// ABOUTME: (/v1/<resource>); Create posts a body, Get Many reads the list. Auth is
// ABOUTME: the Octabiz API credential. No runtime code — n8n drives the routing.

import { NodeConnectionTypes } from 'n8n-workflow';
import type { INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';

// A create field that routes its value into the request body.
const bodyField = (
  displayName: string,
  name: string,
  resource: string,
  extra: Record<string, unknown> = {},
): INodeProperties => ({
  displayName,
  name,
  type: 'string',
  default: '',
  displayOptions: { show: { resource: [resource], operation: ['create'] } },
  routing: { request: { body: { [name]: '={{$value || undefined}}' } } },
  ...extra,
});

const lineItems = (name: string, resource: string, label: string): INodeProperties => ({
  displayName: label,
  name,
  type: 'fixedCollection',
  typeOptions: { multipleValues: true },
  default: {},
  displayOptions: { show: { resource: [resource], operation: ['create'] } },
  routing: { request: { body: { [name]: '={{$value.item}}' } } },
  options: [
    {
      name: 'item',
      displayName: 'Item',
      values: [
        { displayName: 'Description', name: 'description', type: 'string', default: '' },
        { displayName: 'Quantity', name: 'quantity', type: 'number', default: 1 },
        { displayName: 'Unit Price', name: 'unit_price', type: 'number', default: 0 },
      ],
    },
  ],
});

export class Octabiz implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Octabiz',
    name: 'octabiz',
    icon: 'file:octabiz.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Read and create records in Octabiz',
    defaults: { name: 'Octabiz' },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'octabizApi', required: true }],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      headers: { Accept: 'application/json' },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        default: 'customers',
        options: [
          { name: 'Customer', value: 'customers' },
          { name: 'Invoice', value: 'invoices' },
          { name: 'Lead or Deal', value: 'crm-deals' },
          { name: 'Product', value: 'products' },
          { name: 'Sales Order', value: 'orders' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'create',
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a record',
            routing: {
              request: { method: 'POST', url: '={{"/" + $parameter.resource}}' },
              output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
            },
          },
          {
            name: 'Get Many',
            value: 'getMany',
            action: 'Get many records',
            routing: {
              request: { method: 'GET', url: '={{"/" + $parameter.resource}}' },
              output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
            },
          },
        ],
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: { minValue: 1 },
        displayOptions: { show: { operation: ['getMany'] } },
        routing: { request: { qs: { limit: '={{$value}}' } } },
      },

      // Customer
      bodyField('Name', 'name', 'customers', { required: true }),
      bodyField('Email', 'email', 'customers'),
      bodyField('Phone', 'phone', 'customers'),
      bodyField('Company', 'company_name', 'customers'),

      // Invoice
      bodyField('Customer Name', 'customer_name', 'invoices', { required: true }),
      bodyField('Currency', 'currency_code', 'invoices'),
      bodyField('Memo', 'memo', 'invoices'),
      lineItems('line_items', 'invoices', 'Line Items'),

      // Product
      bodyField('Name', 'name', 'products', { required: true }),
      bodyField('SKU', 'internal_sku', 'products'),
      bodyField('Category', 'category', 'products'),
      {
        displayName: 'Sale Price',
        name: 'default_sale_price',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['products'], operation: ['create'] } },
        routing: { request: { body: { default_sale_price: '={{$value || undefined}}' } } },
      },

      // Deal
      bodyField('Title', 'title', 'crm-deals', { required: true }),
      {
        displayName: 'Value',
        name: 'value',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['crm-deals'], operation: ['create'] } },
        routing: { request: { body: { value: '={{$value || undefined}}' } } },
      },
      bodyField('Stage', 'stage', 'crm-deals'),
      bodyField('Source', 'source', 'crm-deals'),

      // Order
      bodyField('Customer ID', 'customer_id', 'orders'),
      bodyField('Channel', 'channel', 'orders'),
      lineItems('items', 'orders', 'Items'),
    ],
  };
}
