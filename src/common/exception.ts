export class ReviewNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewNotFoundError';
  }
}

export class ReviewCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewCreationError';
  }
}

export class ReviewUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewUpdateError';
  }
}

export class ReviewDeletionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewDeletionError';
  }
}