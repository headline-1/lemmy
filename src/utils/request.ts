import request, { CoreOptions, RequestCallback, Response } from 'request';
import { promisify } from 'util';

const HTTP_BAD_REQUEST = 400;
type RequestType = (url: string, options: CoreOptions, callback?: RequestCallback) => void;

class ErrorResponse extends Error {
  constructor(public statusCode: number, message: string, public response: Response) {
    super(message);
  }
}

const handleErrorCodes = (response: Response) => {
  if (response.statusCode >= HTTP_BAD_REQUEST) {
    throw new ErrorResponse(response.statusCode, response.statusMessage, response);
  }
  return response;
};

const addDefaultOptions = (options: CoreOptions): CoreOptions => {
  options.headers['User-Agent'] = 'Lemmy';
  return options;
};

const getRequest = promisify<string, CoreOptions, Response>(request.get as RequestType);
const postRequest = promisify<string, CoreOptions, Response>(request.post as RequestType);
const putRequest = promisify<string, CoreOptions, Response>(request.put as RequestType);
const deleteRequest = promisify<string, CoreOptions, Response>(request.delete as RequestType);

export const get = (url: string, options: CoreOptions): Promise<Response> =>
  getRequest(url, addDefaultOptions(options)).then(handleErrorCodes);

export const post = (url: string, options: CoreOptions): Promise<Response> =>
  postRequest(url, addDefaultOptions(options)).then(handleErrorCodes);

export const put = (url: string, options: CoreOptions): Promise<Response> =>
  putRequest(url, addDefaultOptions(options)).then(handleErrorCodes);

export const del = (url: string, options: CoreOptions): Promise<Response> =>
  deleteRequest(url, addDefaultOptions(options)).then(handleErrorCodes);
