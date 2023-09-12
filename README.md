# schemulous

`schemulous` is a robust and flexible schema definition and validation library for TypeScript, tailored to work seamlessly with OpenAPI version 3 specifications. While defining your schemas for validation, you're also preparing them for OpenAPI documentation, streamlining two processes into one.

## Features

- Define robust schemas with a fluent API.
- Seamless integration with OpenAPI version 3 specifications.
- Comprehensive validation with detailed error messages.
- Full support for TypeScript's type inference.
- Highly customizable to fit your specific needs.
- Zero dependencies for a clean and efficient setup.
- Inspired by `zod`, offering a familiar experience with enhanced OpenAPI capabilities.
- A minimalist version available for those who want to import only the features they need.

## Quick Start

### Installation

Install `schemulous` via npm:

```bash
npm install schemulous
```

### Example Schema Definition

```typescript
import { string, number, boolean, object, enumType, array } from 'schemulous';

const UserSchema = object({
  name: string().minLength(3).maxLength(50),
  age: number().int().minimum(18).maximum(100),
  email: string().email(),
  birthDate: string().date(),
  status: enumType(['active', 'inactive', 'suspended']).default('suspended'),
  isPremiumMember: boolean(),
  hobbies: array(string()),
  weight: number().minimum(0).exclusiveMinimum().meta({
    title: 'Weight',
    description: 'User\'s weight in kilograms, which must be greater than 0.',
    example: 65
  }),
  height: number().nullable(),
  nickname: string().optional(),
  createdAt: string().dateTime().meta({ readOnly: true }),
  updatedAt: string().dateTime().meta({ readOnly: true }),
});
```

## Type Inference with `Infer`

One of the powerful features of `schemulous` is its ability to infer TypeScript types directly from your schema definitions. This ensures that your data structures and their validations are always in sync, reducing potential type-related issues in your codebase.

To infer a type from a schema, you can use the `Infer` utility:

```typescript
type User = Infer<typeof UserSchema>;
```

With the above line, a new type named `User` is created. This type will have all the properties and constraints defined in `UserSchema`. Any changes made to the schema will automatically reflect in the `User` type, ensuring consistency and reducing manual type updates.

If you were to manually define the `User` type, it would look something like this:

```typescript
type User = {
  name: string;
  age: number;
  email: string;
  birthDate: string;
  status: "active" | "inactive" | "suspended";
  isPremiumMember: boolean;
  hobbies: string[];
  weight: number;
  height: number | null;
  nickname: string | undefined;
  createdAt: string;
  updatedAt: string;
}
```

This inferred type can then be used throughout your codebase wherever you need to reference the structure of a user, be it in function parameters, class properties, or elsewhere.

### Conversion to OpenAPI

Using the `toOpenApi` function, you can convert the defined schema into an OpenAPI representation:

```typescript
import { toOpenApi } from 'schemulous';

const OpenApiRepresentation = toOpenApi(UserSchema);
console.log(OpenApiRepresentation);
```

The output will be:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "minLength": 3, "maxLength": 50 },
    "age": { "type": "integer", "minimum": 18, "maximum": 100 },
    "email": { "type": "string", "format": "email" },
    "birthDate": { "type": "string", "format": "date" },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "suspended"],
      "default": "suspended"
    },
    "isPremiumMember": { "type": "boolean" },
    "hobbies": { "type": "array", "items": { "type": "string" } },
    "weight": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true,
      "title": "Weight",
      "description": "User's weight in kilograms, which must be greater than 0.",
      "example": 65
    },
    "height": { "type": "number", "nullable": true },
    "nickname": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time", "readOnly": true },
    "updatedAt": { "type": "string", "format": "date-time", "readOnly": true }
  },
  "required": ["name", "age", "email", "birthDate", "status", "isPremiumMember", "hobbies", "weight", "height", "createdAt", "updatedAt"]
}
```

## Validation

To validate data against your schema, you can use the `parse` method:

```typescript
import { ValidationError } from 'schemulous';

try {
  const validData = UserSchema.parse(data);
  console.log(validData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.issues);
  }
}
```

If you prefer not to use try-catch, you can utilize the `safeParse` method:

```typescript
const result = UserSchema.safeParse(data);

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.issues);
}
```

The `safeParse` method returns either a `SafeParseSuccess` object containing the validated data or a `SafeParseError` object detailing the validation issues.
