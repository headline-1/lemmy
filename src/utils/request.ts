import http from 'http';
import https from 'https';
import URL from 'url';

type Method = 'POST' | 'GET' | 'DELETE' | 'PUT';

export const request = (
  method: Method, url: string, data?: string | object, headers?: object
): Promise<string> => new Promise<string>(((resolve, reject) => {
  const { host, port, path, protocol } = URL.parse(url);
  const contentType = typeof data === 'string' ? 'text/plain' : 'application/json';
  if (data !== 'string') {
    data = JSON.stringify(data);
  }
  const options = {
    host,
    port,
    path,
    method,
    headers: {
      ...headers,
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(data),
    },
  };

  let finished = false;
  let request = http.request;
  if (protocol === 'https') {
    request = https.request;
  }
  const req = request(options, (res) => {
    res.setEncoding('utf8');
    let response = '';
    res.on('data', (chunk) => {
      if (finished) {
        return;
      }
      response += chunk;
    });
    res.on('end', () => {
      if (finished) {
        return;
      }
      finished = true;
      resolve(response);
    });
  });
  req.on('error', (err) => {
    if (finished) {
      return;
    }
    finished = true;
    reject(err);
  });

  req.write(data);
  req.end();
}));
