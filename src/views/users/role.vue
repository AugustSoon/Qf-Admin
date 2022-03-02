<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'adminUsers.role.addRole'" type="primary" @click="handleCreate">添加角色</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              auth: 'adminUsers.role.editRole',
              onClick: handleEdit.bind(null, record.id),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'adminUsers.role.deleteRole',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.id),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import RoleModal from './RoleModal.vue'
  import { useModal } from '/@/components/Modal'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { roleApi } from '/@/api/sys/role'
  import { columns, searchFormSchema } from './role.data'

  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, RoleModal },
    setup() {
      const [registerModal, { openModal }] = useModal()
      const { createMessage } = useMessage()

      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: roleApi.list,
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

      async function handleEdit(id: number) {
        try {
          const record = await roleApi.detail(id)
          openModal(true, {
            record,
            isUpdate: true,
          })
        } catch (err) {
          console.log(err)
        }
      }

      function handleDelete(id: number) {
        roleApi.del(id).then(() => {
          createMessage.success('删除成功')
          handleSuccess()
        })
      }

      function handleSuccess() {
        reload()
      }

      return {
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
