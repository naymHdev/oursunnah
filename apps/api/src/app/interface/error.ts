export type TErrorSource = {
  path: string;
  message: string;
};

export type TErrorSources = TErrorSource[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
