import { defHttp } from '/@/utils/http/axios'
import { BasicParams } from '../model/baseModel'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'

enum Api {
  User = '/user',
  Roles = '/roles',
  Logs = '/logs',
  ClearLogs = '/logs_clear',
  ClearCache = '/menu_cache_clear',
  Login = '/login',
  Logout = '/logout',
  ResetPassword = '/reset_password',
  GetUserInfo = '/me',
  GetPermCode = '/permissions',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}

export function resetPassword(data: BasicParams) {
  return defHttp.post({
    data,
    url: Api.ResetPassword
  })
}

export const userApi = {
  list: (params: BasicParams) => {
    return defHttp.get({
      params,
      url: Api.User,
    })
  },
  roles: () => {
    return defHttp.get({
      url: Api.Roles,
    })
  },
  create: (data: BasicParams) => {
    return defHttp.post({
      data,
      url: Api.User,
    })
  },
  edit: (id: number, data: BasicParams) => {
    return defHttp.put({
      data,
      url: `${Api.User}/${id}`,
    })
  },
  del: (id: number) => {
    return defHttp.get({
      url: Api.User,
      params: `/${id}`,
    })
  },
}

export const logsApi = {
  list: (params: BasicParams) => {
    return defHttp.get({
      params,
      url: Api.Logs,
    })
  },
  clear: () => {
    return defHttp.post({
      url: Api.ClearLogs,
    })
  },
  clearCache: () => {
    return defHttp.post({
      url: Api.ClearCache,
    })
  },
}
