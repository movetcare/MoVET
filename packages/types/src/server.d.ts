export type ServerResponse = {
  status: 200 | 400 | 405 | 500;
  error?: string;
};
