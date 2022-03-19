<template>
  <a-table :columns="columns" :dataSource="list" :pagination="false" rowKey="id">
    <template #sort="{ record }">
      <InputNumber v-model:value="record.sort" :min="1" />
    </template>
    <template #group="{ record }">
      {{ getMapName(record.group, 'group') }}
    </template>
    <template #type="{ record }">
      {{ getMapName(record.type, 'type') }}
    </template>
    <template #status="{ record }">
      <Tag v-if="record.status == 1" color="#2db7f5">显示</Tag>
      <Tag v-else color="#f50">隐藏</Tag>
    </template>
    <template #action="{ index, record }">
      <a-button type="link" size="small" @click="handleEdit(index)">修改</a-button>
      <Popconfirm title="确认删除吗？" @confirm="handleDel(record.id)">
        <a-button type="link" size="small" color="error">删除</a-button>
      </Popconfirm>
    </template>
    <template #expandedRowRender="{ record }">
      <Descriptions
        bordered
        :column="1"
        :labelStyle="{ width: '100px' }"
        :contentStyle="{ backgroundColor: '#fff' }"
      >
        <DescriptionsItem v-if="record.options.length > 0" label="选项">
          {{ record.options.join(',') }}
        </DescriptionsItem>
        <DescriptionsItem label="内容">{{ record.value }}</DescriptionsItem>
      </Descriptions>
    </template>
  </a-table>
  <div class="bottom">
    <a-button style="float: left" size="small" color="warning" @click="handleSort">
      更新排序
    </a-button>
    <Pagination
      v-model:current="fetchParams.page"
      :page-size="fetchParams.limit"
      :total="total"
      :show-total="(total: number) => `共 ${total} 条数据`"
      @change="getList"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, reactive, watch, onMounted } from 'vue'

  import {
    Table,
    InputNumber,
    Popconfirm,
    Descriptions,
    DescriptionsItem,
    Tag,
    Pagination,
  } from 'ant-design-vue'
  import type { ColumnProps } from 'ant-design-vue/lib/table/interface'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { setApi } from '/@/api/sys/config'

  export default defineComponent({
    name: 'SetTable',
    components: {
      ATable: Table,
      InputNumber,
      Popconfirm,
      Descriptions,
      DescriptionsItem,
      Tag,
      Pagination,
    },
    props: {
      t: {
        type: Number,
        default: 0,
      },
      group: {
        type: String,
        default: 'all',
      },
      keyword: {
        type: String,
        default: '',
      },
      types: {
        required: true,
        type: Array as PropType<Recordable[]>,
      },
      groups: {
        required: true,
        type: Array as PropType<Recordable[]>,
      },
    },
    emits: ['edit'],
    setup(props, { emit }) {
      const total = ref(0)
      const list = ref<Recordable[]>([])
      const { t, group, keyword, types, groups } = toRefs(props)
      const fetchParams = reactive({ page: 1, limit: 20 })

      const { createMessage } = useMessage()

      const columns: ColumnProps[] = [
        {
          title: '排序',
          dataIndex: 'sort',
          width: '100px',
          slots: { customRender: 'sort' },
        },
        {
          title: '配置分组',
          dataIndex: 'group',
          slots: { customRender: 'group' },
        },
        {
          title: '配置标题',
          dataIndex: 'title',
        },
        {
          title: '配置别名',
          dataIndex: 'name',
        },
        {
          title: '配置类型',
          dataIndex: 'type',
          slots: { customRender: 'type' },
        },
        {
          title: '配置状态',
          dataIndex: 'status',
          slots: { customRender: 'status' },
        },
        {
          title: '操作',
          align: 'center',
          slots: { customRender: 'action' },
        },
      ]

      async function getList() {
        const params = { ...fetchParams, group: group.value, keyword: keyword.value }
        const data = await setApi.list(params)
        list.value = data.list
        total.value = data.total
      }

      function getMapName(key: string, type: string) {
        const map = type === 'type' ? types.value : groups.value

        const one = map.find((item) => item.key === key)

        return one ? one.label : key
      }

      function handleEdit(index: number) {
        emit('edit', list.value[index])
      }

      async function handleSort() {
        const data = list.value.map((item) => {
          return {
            id: item.id,
            sort: /^[1-9][0-9]*$/.test(item.sort) ? item.sort : 1,
          }
        })

        try {
          await setApi.sort({ data })
          getList()
        } catch (err) {
          console.log(err)
        }
      }

      async function handleDel(id: number) {
        try {
          await setApi.del(id)
          getList()
          createMessage.success('删除成功')
        } catch (err) {
          console.log(err)
        }
      }

      watch(
        () => keyword.value,
        () => {
          getList()
        },
      )

      watch(
        () => t.value,
        () => {
          getList()
        },
      )

      onMounted(() => {
        getList()
      })

      return {
        total,
        list,
        columns,
        fetchParams,
        getList,
        handleDel,
        handleEdit,
        handleSort,
        getMapName,
      }
    },
  })
</script>

<style lang="less" scoped>
  .bottom {
    padding: 20px;
    text-align: right;
  }
</style>
