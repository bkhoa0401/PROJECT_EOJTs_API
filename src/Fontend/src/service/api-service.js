import Auth from './auth-service';
import { isNullOrUndefined } from './common-service';

const API = 'http://localhost:8000/api';

const Get = async function (api, query = '') {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();

  const setting = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    method: 'GET',
  }
  const response = await fetch(API + api, setting);
  if (response.status == 204 || response.status == 401) {
    return null;
  }
  const data = await response.json();
  return data;
}

const Post = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': token,
    },
    method: 'post',
    body: JSON.stringify(query),
  }
  const response = await fetch(API + api, setting);
  if (response.status == 401 || response.status == 403) {
    return null;
  }
  // const data = await response.json();
  return response;
}

const PostNotifications = async function (api, query) {
  const tokenServer = 'AAAAVQM8Apk:APA91bHE-Xn-G2JIYAA-4rGXjHJGXmXicR31ZsorPmgRMYGLiZ4CkN8cPTyhCSE-yK3HjIuAJyg8g8ngVSekypXxb9f2YRhtbqsHHdtP6qkj0oFgYV1i2AeVBaF8BiRJbcnYN8Ic2op_';
  if (isNullOrUndefined(api)) {
    return;
  }

  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': 'key=' + tokenServer,
    },
    method: 'post',
    body: JSON.stringify(query),
  }
  const response = await fetch(api, setting);
  if (response.status == 401 || response.status == 403) {
    return null;
  }
  // const data = await response.json();
  return response;
}

const Put = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'content-type': 'application/json',
      'Authorization': token,
    },
    method: 'put',
    body: JSON.stringify(query),
  }
  const response = await fetch(API + api, setting);
  //const data = await response.json();
  if (response.status == 401 || response.status == 403) {
    return null;
  }
  return response;
}

const Delete = async function (api, query) {
  if (isNullOrUndefined(api)) {
    return;
  }
  const token = Auth.getToken();
  const setting = {
    headers: {
      'Authorization': token,
    },
    method: 'delete',
  }
  const response = await fetch(API + api, setting);
  if (response.status == 401 || response.status == 403) {
    return null;
  }
  return response;
}
const ApiServices = {
  Get,
  Post,
  PostNotifications,
  Put,
  Delete,
  API
}

export default ApiServices;