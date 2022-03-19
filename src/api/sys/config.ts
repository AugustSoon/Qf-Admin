import { defHttp } from '/@/utils/http/axios'
import { BasicParams } from '../model/baseModel'

enum Api {
  Set = '/config_set',
  Map = '/config_map',
  Config = '/config',
}

export function configMap() {
  return defHttp.get({ url: Api.Map })
}

export const setApi = {
  list: (params: BasicParams) => {
    return defHttp.get({
      params,
      url: Api.Set,
    })
  },
  sort: (data: BasicParams) => {
    return defHttp.post({
      data,
      url: `${Api.Set}/sort`,
    })
  },
  create: (data: BasicParams) => {
    return defHttp.post({
      data,
      url: Api.Set,
    })
  },
  edit: (id: number, data: BasicParams) => {
    return defHttp.put({
      data,
      url: `${Api.Set}/${id}`,
    })
  },
  del: (id: number) => {
    return defHttp.delete({
      url: Api.Set,
      params: `/${id}`,
    })
  },
}

export const configApi = {
  group: () => {
    return defHttp.get({
      url: `${Api.Config}/group`,
    })
  },
  list: (params: BasicParams) => {
    return defHttp.get({
      params,
      url: Api.Config,
    })
  },
  update: (data: BasicParams) => {
    return defHttp.post({
      data,
      url: Api.Config,
    })
  },
}
