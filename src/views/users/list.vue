<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'adminUsers.list.addAdminUser'" type="primary" @click="handleCreate">添加用户</a-button>
      </template>

      <template #expandedRowRender="{ record }">
        <Description :column="2" :data="record" :schema="schema" />
      </template>

      <template #roles="{ record }">
        {{ record.roles.map((item) => item.name).join('、') }}
      </template>

      <template #status="{ record }">
        <a-tag v-if="record.status == 1" color="#87d068">启用</a-tag>
        <a-tag v-else color="#f50">禁用</a-tag>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              auth: 'adminUsers.list.editAdminUser',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'adminUsers.list.deleteAdminUser',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.id),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Tag } from 'ant-design-vue'

  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { Description, DescItem } from '/@/components/Description/index'
  import UserModal from './UserModal.vue'
  import { useModal } from '/@/components/Modal'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { formatToDateTime } from '/@/utils/dateUtil'

  import { userApi } from '/@/api/sys/user'
  import { columns, searchFormSchema } from './user.data'

  export default defineComponent({
    name: 'UserManagement',
    components: { BasicTable, TableAction, Description, UserModal, ATag: Tag },
    setup() {
      const [registerModal, { openModal }] = useModal()
      const { createMessage } = useMessage()

      const schema: DescItem[] = [
        {
          label: '上次登录时间',
          field: 'last_login_time',
          render: (curVal) => {
            return formatToDateTime(curVal * 1000)
          },
        },
        {
          label: '上次登录IP',
          field: 'last_login_ip',
        },
        {
          label: '创建时间',
          field: 'created_at',
        },
        {
          label: '创建人',
          field: 'creator.nickname',
        }
      ]

      const [registerTable, { reload }] = useTable({
        title: '用户列表',
        api: userApi.list,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        })
      }

      function handleEdit(record: Recordable) {
        const { id, status, username, nickname, roles } = record

        openModal(true, {
          isUpdate: true,
          record: { id, status: status === 1, username, nickname, roles: roles.map(item => item.id) },
        })
      }

      function handleDelete(id: number) {
        userApi.del(id).then(() => {
          createMessage.success('删除成功')
          handleSuccess()
        })
      }

      function handleSuccess() {
        reload()
      }

      return {
        schema,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      }
    },
  })
</script>
