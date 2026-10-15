const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
} as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
} as const;

export const messages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
} as const;
