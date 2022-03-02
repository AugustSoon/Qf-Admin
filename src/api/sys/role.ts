import { defHttp } from '/@/utils/http/axios'
import { BasicParams } from '../model/baseModel'

enum Api {
  Role = '/role',
  Menu = '/menus'
}

export const roleApi = {
  list: (params: BasicParams) => {
    return defHttp.get({
      params,
      url: Api.Role,
    })
  },
  detail: (id: number) => {
    return defHttp.get({
      url: `${Api.Role}/${id}`,
    })
  },
  menu: () => {
    return defHttp.get({
      url: Api.Menu,
    })
  },
  create: (data: BasicParams) => {
    return defHttp.post({
      data,
      url: Api.Role,
    })
  },
  edit: (id: number, data: BasicParams) => {
    return defHttp.put({
      data,
      url: `${Api.Role}/${id}`,
    })
  },
  del: (id: number) => {
    return defHttp.delete({
      url: Api.Role,
      params: `/${id}`
    })
  },
}
