export type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    loginType: string;
    email: string;
    password: string;
  };
  error?: string;
};
