export class OpenApiError extends Error {
  path: (string | number)[];

  constructor(message: string, path?: (string | number)[]) {
    super(message);
    this.name = 'OpenApiError';
    this.path = path ?? [];
  }
}
