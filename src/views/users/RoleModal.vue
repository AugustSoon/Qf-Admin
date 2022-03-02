<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #permission>
        <BasicTree
          style="padding-bottom: 10px;"
          checkable
          :treeData="menuData"
          :replaceFields="{ title: 'introduction' }" 
          :checkStrictly="checkStrictly"
          :checkedKeys="checkedKeys"
          @check="menuCheck"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref, nextTick } from 'vue'

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
      const checkStrictly = ref(false)
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
          rowId.value = data.record.id
          checkStrictly.value = true
          checkedKeys.value = data.record.permission
          setFieldsValue({...data.record})
          await nextTick()
          checkStrictly.value = false
        } else {
          checkedKeys.value = []
        } 
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '添加角色' : '编辑角色'))

      async function menuCheck(checkKeys: string[], e: CheckEvent) {
        const { halfCheckedKeys } = e
        const permission = [...checkKeys, ...halfCheckedKeys]
        checkStrictly.value = true
        setFieldsValue({
          permission
        })
        await nextTick()
        checkStrictly.value = false
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
        } catch(err) {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        menuData,
        getTitle,
        checkStrictly,
        checkedKeys,
        menuCheck,
        handleSubmit,
        registerForm,
        registerModal,
      }
    },
  })
</script>
