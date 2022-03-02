<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-popconfirm
        title="确认清空日志吗？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="handleClear"
      >
        <a-button v-auth="'adminControllerLogs.clearAdminLogs'" color="error">清空日志</a-button>
      </a-popconfirm>
      <a-button type="primary" @click="handleCache">清除菜单缓存</a-button>
    </template>

    <template #expandedRowRender="{ record }">
      {{ record.content }}
    </template>

    <template #operator="{ record }">
      {{ record.operator_name }}/{{ record.action_uid }}
    </template>

    <template #method="{ record }">
      <a-tag v-if="record.method == 'DELETE'" color="#f50">{{ record.method }}</a-tag>
      <a-tag v-else-if="record.method == 'PUT'" color="#87d068">{{ record.method }}</a-tag>
      <a-tag v-else color="#2db7f5">{{ record.method }}</a-tag>
    </template>

    <template #status="{ record }">
      <a-tag v-if="record.status == 1" color="#87d068">成功</a-tag>
      <a-tag v-else color="#f50">失败</a-tag>
    </template>
  </BasicTable>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Tag, Popconfirm } from 'ant-design-vue'

  import { BasicTable, useTable } from '/@/components/Table'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { logsApi } from '/@/api/sys/user'
  import { columns, searchFormSchema } from './logs.data'

  export default defineComponent({
    name: 'LogsManagement',
    components: { BasicTable, ATag: Tag, APopconfirm: Popconfirm },
    setup() {
      const { createMessage } = useMessage()

      const [registerTable, { reload }] = useTable({
        title: '日志列表',
        api: logsApi.list,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false
      })

      function handleClear() {
        logsApi.clear().then(() => {
          createMessage.success('清除成功')
          reload()
        })
      }

      function handleCache() {
        logsApi.clearCache().then(() => {
          createMessage.success('清除成功')
          reload()
        })
      }

      return {
        registerTable,
        handleClear,
        handleCache,
      }
    },
  })
</script>
