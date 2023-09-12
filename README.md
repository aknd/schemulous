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

### Type Inference with `Infer`

One of the powerful features of `schemulous` is its ability to infer TypeScript types directly from your schema definitions. This ensures that your data structures and their validations are always in sync, reducing potential type-related issues in your codebase.

To infer a type from a schema, you can use the `Infer` utility:

```typescript
import { type Infer } from 'schemulous';

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

### Validation

To validate data against your schema, you can use the `parse` method:

```typescript
import { ValidationError } from 'schemulous';

const data = {
  name: "John Doe",
  age: 25,
  email: "john.doe@example.com",
  birthDate: "1996-05-15",
  status: "active",
  isPremiumMember: true,
  hobbies: ["reading", "hiking", "swimming"],
  weight: 70,
  height: 175,
  nickname: "Johnny",
  createdAt: "2022-01-01T12:00:00Z",
  updatedAt: "2022-01-02T12:00:00Z",
};

try {
  const validData = UserSchema.parse(data);
  // Here, validData contains the parsed data that adheres to the defined schema.
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

### Error Handling

```typescript
const invalidUserData = {
  name: "Jo", // Too short, minimum length is 3
  age: 15,    // Below the minimum age of 18
  email: "not-an-email", // Not a valid email format
  // ... other fields
};

const result = UserSchema.safeParse(invalidUserData);

if (!result.success) {
  console.log(result.error.issues);
  /*
    [ { code: 'too_small',
        inclusive: true,
        message: 'String must contain at least 3 character(s)',
        minimum: 3,
        path: [ 'name' ],
        type: 'string' },
      { code: 'too_small',
        inclusive: true,
        message: 'Number must be greater than or equal to 18',
        minimum: 18,
        path: [ 'age' ],
        type: 'number' },
      { code: 'invalid_string',
        message: 'Invalid email',
        path: [ 'email' ],
        validation: 'email' } ]
  */
}
```
### Custom Error Messages

`schemulous` provides default error messages for validations, but there might be cases where you'd want to customize these messages to better fit your application's context or to provide more user-friendly feedback.

For instance, when using the `minLength` validator on a `string()`, you can provide a custom error message in two ways:

1. Directly passing a string.
2. Using a function that returns a string, which allows for dynamic error messages based on the input value.

Let's see how to use these with the `minLength` validator:

#### 1. Direct String

```typescript
const NameSchema = string().minLength(5, "Name must be at least 5 characters long.");
```

#### 2. Function Returning a String

```typescript
const NameSchema = string().minLength(5, (value) => `${value} is too short. Please provide a name with at least 5 characters.`);
```

In the second example, the error message will include the actual input value, making the feedback more specific to the user's input.

By customizing error messages, you can ensure that your application provides clear and actionable feedback to users, enhancing the overall user experience.

## Schema Copying

When working with `schemulous`, there might be scenarios where you want to reuse an existing schema but with slight modifications. In such cases, it's essential to be aware of the mutable nature of schemas. Directly chaining methods to an existing schema will modify the original schema, which might not be the desired behavior.

To avoid unintentional modifications, `schemulous` provides a `copy` method. By copying a schema, you can derive a new schema from the original one without affecting the original schema.

### Why Copy?

1. **Immutability**: Ensure that the original schema remains unchanged when you want to create variations.
2. **Flexibility**: Easily create multiple versions of a schema based on a common base schema.

### Example

Let's consider a simple string schema:

```typescript
const BaseNameSchema = string().minLength(5);
```

Now, suppose you want a new schema derived from `BaseNameSchema` but with an added constraint of a maximum length:

```typescript
const CopiedNameSchema = BaseNameSchema.copy().maxLength(10);
```

By using `copy()`, `BaseNameSchema` remains unaffected, and you have a new schema `CopiedNameSchema` with both the minimum and maximum length constraints.

Always remember to use the `copy` method when you want to extend or modify an existing schema without altering its original definition. This ensures clarity and avoids potential bugs in your schema definitions.

## Minimalist Version: `schemulous/core`

While the fluent API and method chaining in `schemulous` offer a concise and readable way to define schemas, it comes with a trade-off. Every method in the chain, even if not used, gets bundled in the final build, potentially increasing the size of your application.

To cater to developers who prefer a leaner approach, `schemulous` offers a minimalist version. This version allows you to import only the functionalities you need, ensuring a smaller footprint.

### How to Use the Minimalist Version?

1. **Core Imports**: Instead of importing from `schemulous`, use `schemulous/core` for the basic functionalities.

   ```typescript
   import { string, safeParse } from 'schemulous/core';
   ```

2. **Extensions**: For additional methods that were previously available through chaining, you can import them from `schemulous/extensions`.

   ```typescript
   import { minLength } from 'schemulous/extensions';
   ```

3. **Usage**: Instead of chaining, you'll use the imported methods as functions, passing the schema as the first argument.

   ```typescript
   const NameSchema = minLength(string(), 5);
   ```

By adopting this minimalist approach, you can ensure that you're only bundling the functionalities you need, making your application leaner and potentially faster. This is especially beneficial for web applications where every kilobyte matters for performance.

## Customizing Schemas with `refine`

In many scenarios, the built-in validation methods might not cover all the specific requirements you have for your data. `schemulous` provides a flexible way to add custom validation logic to your schemas using the `refine` method.

### How to Use `refine`?

1. **Basic Usage**: You can use `refine` to add a custom validation function. This function should return `true` if the value is valid and `false` otherwise.

   ```typescript
   const NameSchema = string()
     .minLength(5)
     .refine((value) => value.startsWith('start-'));
   ```

   In the above example, the `NameSchema` not only requires the string to be at least 5 characters long but also mandates that it starts with the prefix 'start-'.

2. **Custom Error Messages**: By default, if the custom validation fails, a generic error message is provided. However, you can specify a custom error message by passing it as the second argument to `refine`.

   ```typescript
   const NameSchema = string()
     .minLength(5)
     .refine(
       (value) => value.startsWith('start-'),
       "Name must start with 'start-' prefix."
     );
   ```

   Alternatively, you can provide a function that returns a string, allowing for more dynamic error messages based on the value being validated.

3. **OpenAPI Integration**: It's important to note that custom validations added with `refine` won't be reflected in the OpenAPI output generated by `toOpenApi`. If you want to document this custom behavior, you can use the `meta` method to add relevant `format` or `description` details.

   ```typescript
   const NameSchema = string()
     .minLength(5)
     .refine((value) => value.startsWith('start-'))
     .meta({
       description: "A string that starts with 'start-' and has a minimum length of 5 characters."
     });
   ```

By leveraging the `refine` method, you can ensure that your schemas are tailored to your specific needs, providing both robust validation and clear documentation.
