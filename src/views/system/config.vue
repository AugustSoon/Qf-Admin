<template>
  <PageWrapper content-full-height class="bg-white">
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in groupList" :key="item.key" :tab="item.label">
        <ConfigForm
          v-if="activeKey == item.key"
          :group="activeKey"
          :types="types"
          :groups="groups"
        />
      </a-tab-pane>
    </a-tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Tabs, TabPane } from 'ant-design-vue'

  import { PageWrapper } from '/@/components/Page'
  import ConfigForm from './ConfigForm.vue'

  import { configMap, configApi } from '/@/api/sys/config'

  export default defineComponent({
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: TabPane,
      ConfigForm,
    },
    setup() {
      const activeKey = ref('')
      const types = ref<Recordable[]>([])
      const groups = ref<Recordable[]>([])
      const groupList = ref<Recordable[]>([])

      async function getMap() {
        const data = await configMap()
        const { type, group } = data

        types.value = type
        groups.value = group

        const list = await configApi.group()

        groupList.value = list.map((item: Recordable) => {
          return group.find((one: Recordable) => one.key === item.group)
        })

        if (list.length > 0) activeKey.value = list[0].group
      }

      onMounted(() => {
        getMap()
      })

      return {
        types,
        groups,
        groupList,
        activeKey,
      }
    },
  })
</script>
