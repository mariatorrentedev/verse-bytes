export type LoginForm = {
  email: string;
  password: string;
  name?: string;
};

export type Password = {
  hash: string;
  userId: string;
};
