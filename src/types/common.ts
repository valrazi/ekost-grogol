export type ResponseStrict<T> = {
  data: T;
  meta: {
    version: string;
  };
  error?: Error
};

export type Error = {
  code: number,
  title: string,
  message: string
}
export type Response<T> = ResponseStrict<{
  code: number;
  message: string;
  version: string;
  data: T;
}>;

export type Media = {
  objectKey: string;
  uri: string;
  publicUrl: string;
  publicUrls: string[];
  etag: string;
  versionId: string;
}
