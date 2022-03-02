<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #selectRole="{ model, field }">
        <a-select mode="multiple" :options="roleData" v-model:value="model[field]" allowClear />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'

  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { Select } from 'ant-design-vue'

  import { userFormSchema } from './user.data'
  import { userApi } from '/@/api/sys/user'

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, ASelect: Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowId = ref(0)
      const isUpdate = ref(true)
      const roleData = ref([])

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 80,
        schemas: userFormSchema,
        showActionButtonGroup: false,
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        if (unref(roleData).length === 0) {
          const roles = await userApi.roles()

          roleData.value = roles.map((item) => {
            return {
              key: item.id,
              value: item.id,
              label: item.name,
            }
          })
        }

        let rules = [{ required: true }, { min: 8, message: '密码长度至少8位' }]

        if (unref(isUpdate)) {
          rules = [{ min: 8, message: '密码长度至少8位' }]
          rowId.value = data.record.id
          setFieldsValue({ ...data.record })
        } else {
          setFieldsValue({
            status: true,
          })
        }

        updateSchema({
          field: 'password',
          rules,
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '添加用户' : '编辑用户'))

      async function handleSubmit() {
        try {
          const params = await validate()

          setModalProps({ confirmLoading: true })

          if (unref(rowId) > 0) {
            await userApi.edit(rowId.value, params)
          } else {
            await userApi.create(params)
          }

          setModalProps({ confirmLoading: false })
          closeModal()
          emit('success')
        } catch (err) {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        getTitle,
        roleData,
        handleSubmit,
        registerForm,
        registerModal,
      }
    },
  })
</script>
