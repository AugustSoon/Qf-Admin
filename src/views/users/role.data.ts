import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '创建人',
    dataIndex: 'creator.nickname'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at'
  }
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 4 },
  }
]

export const roleFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'permission',
    label: '权限',
    component: 'Input',
    slot: 'permission',
    rules: [{ required: true, type: 'array', message: '请选择权限' }],
  }
]