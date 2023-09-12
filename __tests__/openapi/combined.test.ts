import { describe, expect, test } from 'vitest';
import {
  array,
  boolean,
  enumType,
  number,
  object,
  string,
  toOpenApi,
} from '../../src';

describe('toOpenApi Combined Tests', () => {
  test('should convert complex request schema to OpenAPI format', () => {
    // Request: User registration
    const UserRegistrationRequest = object({
      username: string()
        .minLength(5)
        .maxLength(20)
        .pattern(/^[a-zA-Z0-9]+$/)
        .meta({
          title: 'Username',
          description: "User's unique identifier",
        }),
      password: string().minLength(8).meta({
        title: 'Password',
        description: "User's secret password",
      }),
      email: string().email().meta({
        title: 'Email Address',
        description: "User's email address",
      }),
      uuid: string().uuid().meta({
        title: 'UUID',
        description: "User's unique UUID",
      }),
      birthDate: string().date().meta({
        title: 'Birth Date',
        description: "User's date of birth",
      }),
      registrationDate: string().dateTime().meta({
        title: 'Registration Date',
        description: 'Date and time when the user registered',
      }),
      phoneNumber: string().numeric().minLength(10).maxLength(15).meta({
        title: 'Phone Number',
        description: "User's phone number",
      }),
      age: number()
        .int()
        .minimum(18)
        .exclusiveMinimum()
        .maximum(100)
        .exclusiveMaximum()
        .multipleOf(1)
        .meta({
          title: 'Age',
          description: "User's age",
        }),
      preferences: object({
        newsletter: boolean().default(true),
        notifications: enumType(['email', 'sms', 'none']),
      }).meta({
        title: 'Preferences',
        description: "User's preferences settings",
      }),
      contacts: array(
        object({
          name: string(),
          relation: enumType(['friend', 'family', 'colleague']),
        })
      )
        .minItems(1)
        .maxItems(10)
        .meta({
          title: 'Contacts',
          description: "List of user's contacts",
        }),
    }).meta({
      title: 'User Registration Request',
      description: 'Data required for user registration',
    });

    const OpenApiRequest = toOpenApi(UserRegistrationRequest);

    // Assertions
    expect(OpenApiRequest).toEqual({
      type: 'object',
      title: 'User Registration Request',
      description: 'Data required for user registration',
      properties: {
        username: {
          type: 'string',
          minLength: 5,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9]+$',
          title: 'Username',
          description: "User's unique identifier",
        },
        password: {
          type: 'string',
          minLength: 8,
          title: 'Password',
          description: "User's secret password",
        },
        email: {
          type: 'string',
          format: 'email',
          title: 'Email Address',
          description: "User's email address",
        },
        uuid: {
          type: 'string',
          format: 'uuid',
          title: 'UUID',
          description: "User's unique UUID",
        },
        birthDate: {
          type: 'string',
          format: 'date',
          title: 'Birth Date',
          description: "User's date of birth",
        },
        registrationDate: {
          type: 'string',
          format: 'date-time',
          title: 'Registration Date',
          description: 'Date and time when the user registered',
        },
        phoneNumber: {
          type: 'string',
          minLength: 10,
          maxLength: 15,
          title: 'Phone Number',
          description: "User's phone number",
        },
        age: {
          type: 'integer',
          minimum: 18,
          exclusiveMinimum: true,
          maximum: 100,
          exclusiveMaximum: true,
          multipleOf: 1,
          title: 'Age',
          description: "User's age",
        },
        preferences: {
          type: 'object',
          properties: {
            newsletter: {
              type: 'boolean',
              default: true,
            },
            notifications: {
              type: 'string',
              enum: ['email', 'sms', 'none'],
            },
          },
          required: ['newsletter', 'notifications'],
          title: 'Preferences',
          description: "User's preferences settings",
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relation: {
                type: 'string',
                enum: ['friend', 'family', 'colleague'],
              },
            },
            required: ['name', 'relation'],
          },
          minItems: 1,
          maxItems: 10,
          title: 'Contacts',
          description: "List of user's contacts",
        },
      },
      required: [
        'username',
        'password',
        'email',
        'uuid',
        'birthDate',
        'registrationDate',
        'phoneNumber',
        'age',
        'preferences',
        'contacts',
      ],
    });
  });
});
