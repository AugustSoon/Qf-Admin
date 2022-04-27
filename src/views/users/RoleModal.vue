<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #permission>
        <BasicTree
          style="padding-bottom: 10px"
          checkable
          :treeData="menuData"
          :checkStrictly="true"
          :checkedKeys="checkedKeys"
          :replaceFields="{ title: 'introduction' }"
          @check="menuCheck"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'

  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { BasicTree, TreeItem, CheckEvent } from '/@/components/Tree'

  import { roleFormSchema } from './role.data'
  import { roleApi } from '/@/api/sys/role'

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowId = ref(0)
      const isUpdate = ref(true)
      const menuData = ref<TreeItem[]>([])
      const checkedKeys = ref<string[]>([])

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 80,
        schemas: roleFormSchema,
        showActionButtonGroup: false,
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        if (unref(menuData).length === 0) {
          menuData.value = (await roleApi.menu()) as any as TreeItem[]
        }

        if (unref(isUpdate)) {
          const { id, name, permission } = data.record
          rowId.value = id
          checkedKeys.value = permission
          setFieldsValue({ name, permission })
        } else {
          rowId.value = 0
          checkedKeys.value = []
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '添加角色' : '编辑角色'))

      async function menuCheck(_: Recordable, e: CheckEvent) {
        const { checked } = e
        const { pos, eventKey } = e.node
        const parentKeys = getParentKeys(pos)
        const keys = [eventKey, ...getChildren(pos)]
        const checkedKeysValue = unref(checkedKeys)

        if (checked) {
          keys.forEach((item) => {
            if (checkedKeysValue.findIndex((one) => one === item) === -1) {
              checkedKeysValue.push(item)
            }
          })
          parentKeys.forEach((item) => {
            if (checkedKeysValue.findIndex((one) => one === item) === -1) {
              checkedKeysValue.push(item)
            }
          })
          checkedKeys.value = [...checkedKeysValue]
        } else {
          checkedKeys.value = checkedKeysValue.filter((item) => {
            return keys.findIndex((one) => one === item) === -1
          })
        }

        setFieldsValue({ permission: checkedKeys.value })
      }

      function getParentKeys(pos: string) {
        const path = pos.split('-')
        const item = menuData.value
        let keys: string[] = []
        let data = undefined as any as Recordable

        for (let i = 1; i < path.length - 1; i++) {
          const index = path[i]
          if (!data) data = item[index]
          else data = data.children[index]

          keys.push(data.key)
        }

        return keys
      }

      function getChildren(pos: string) {
        const path = pos.split('-')
        const item = menuData.value
        let data = undefined as any as Recordable

        for (let i = 1; i < path.length; i++) {
          const index = path[i]
          if (!data) data = item[index]
          else data = data.children[index]
        }

        const keys = getChildrenKeys(data)

        return keys
      }

      function getChildrenKeys(data: Recordable, keys: string[] = []) {
        const children = data.children || []

        children.forEach((item: Recordable) => {
          keys.push(item.key)

          if (item.children) {
            keys = getChildrenKeys(item, keys)
          }
        })

        return keys
      }

      async function handleSubmit() {
        try {
          const params = await validate()

          setModalProps({ confirmLoading: true })

          if (unref(rowId) > 0) {
            await roleApi.edit(rowId.value, params)
          } else {
            await roleApi.create(params)
          }

          setModalProps({ confirmLoading: false })
          closeModal()
          emit('success')
        } catch (err) {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        menuData,
        getTitle,
        checkedKeys,
        menuCheck,
        handleSubmit,
        registerForm,
        registerModal,
      }
    },
  })
</script>
