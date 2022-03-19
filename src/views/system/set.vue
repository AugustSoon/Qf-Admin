<template>
  <PageWrapper content-full-height class="bg-white">
    <div class="top">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="配置标题/配置别名" v-model:value="keyword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-form-item>
        <a-form-item>
          <a-button color="success" @click="handleCreate">添加</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane key="all" tab="全部">
        <SetTable
          v-if="activeKey == 'all'"
          :t="t"
          :group="activeKey"
          :keyword="keywordProp"
          :types="types"
          :groups="groups"
          @edit="handleEdit"
        />
      </a-tab-pane>
      <a-tab-pane v-for="item in groups" :key="item.key" :tab="item.label">
        <SetTable
          v-if="activeKey == item.key"
          :t="t"
          :group="activeKey"
          :keyword="keywordProp"
          :types="types"
          :groups="groups"
          @edit="handleEdit"
        />
      </a-tab-pane>
    </a-tabs>
    <SetModal :types="types" :groups="groups" @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'

  import { Form, FormItem, Input, Tabs, TabPane } from 'ant-design-vue'

  import { PageWrapper } from '/@/components/Page'
  import SetModal from './SetModal.vue'
  import SetTable from './SetTable.vue'
  import { useModal } from '/@/components/Modal'

  import { configMap } from '/@/api/sys/config'

  export default defineComponent({
    components: {
      PageWrapper,
      AForm: Form,
      AFormItem: FormItem,
      AInput: Input,
      ATabs: Tabs,
      ATabPane: TabPane,
      SetModal,
      SetTable,
    },
    setup() {
      const t = ref(0)
      const keyword = ref('')
      const keywordProp = ref('')
      const activeKey = ref('all')
      const types = ref<Recordable[]>([])
      const groups = ref<Recordable[]>([])

      const [registerModal, { openModal }] = useModal()

      async function getMap() {
        const data = await configMap()
        const { type, group } = data
        types.value = type
        groups.value = group
      }

      onMounted(() => {
        getMap()
      })

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        })
      }

      function handleSearch() {
        keywordProp.value = keyword.value
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        })
      }

      function handleSuccess() {
        t.value = new Date().getTime()
      }

      return {
        t,
        types,
        groups,
        activeKey,
        keyword,
        keywordProp,
        handleEdit,
        handleSearch,
        handleCreate,
        handleSuccess,
        registerModal,
      }
    },
  })
</script>

<style lang="less" scoped>
  .top {
    margin: 20px 0;
  }
</style>
