import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '操作人/用户ID',
    dataIndex: 'operator_name',
    slots: { customRender: 'operator' },
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'full_path',
  },
  {
    title: '类型',
    dataIndex: 'method',
    slots: { customRender: 'method' },
  },
  {
    title: 'IP',
    dataIndex: 'ip',
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' },
  }
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'uid',
    label: '用户ID',
    component: 'Input',
    colProps: { span: 4 },
  }
]