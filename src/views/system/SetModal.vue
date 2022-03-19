<template>
  <BasicModal
    v-bind="$attrs"
    :title="getTitle"
    :width="700"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <Form
      ref="formRef"
      :model="formParams"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <FormItem name="group" label="配置分组">
        <ASelect v-model:value="formParams.group" placeholder="请选择配置分组">
          <SelectOption v-for="item in groups" :key="item.key" :value="item.key">
            {{ item.label }}
          </SelectOption>
        </ASelect>
      </FormItem>

      <FormItem name="type" label="配置类型">
        <ASelect v-model:value="formParams.type" placeholder="请选择配置类型">
          <SelectOption v-for="item in types" :key="item.key" :value="item.key">
            {{ item.label }}
          </SelectOption>
        </ASelect>
      </FormItem>

      <FormItem name="name" label="配置别名">
        <Input v-model:value="formParams.name" placeholder="请填写配置别名" />
      </FormItem>

      <FormItem name="title" label="配置标题">
        <Input v-model:value="formParams.title" placeholder="请填写配置标题" />
      </FormItem>

      <FormItem v-show="isExtra" name="extra" label="选项">
        <ATextarea v-model:value="formParams.extra" placeholder="请填写选项" />
        <p style="margin: 10px 0 0; color: #999">多个选项之前用英文逗号(,)隔开</p>
      </FormItem>

      <FormItem name="sort" label="排序">
        <InputNumber v-model:value="formParams.sort" :min="1" placeholder="请填写排序" />
      </FormItem>

      <FormItem name="status" label="状态">
        <Switch
          v-model:checked="formParams.status"
          checked-children="显示"
          un-checked-children="隐藏"
        />
      </FormItem>

      <FormItem name="remark" label="备注">
        <ATextarea v-model:value="formParams.remark" placeholder="请填写备注" />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, unref } from 'vue'
  import {
    Form,
    FormItem,
    Input,
    InputNumber,
    Textarea,
    Select,
    SelectOption,
    Switch,
  } from 'ant-design-vue'

  import { useMessage } from '/@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '/@/components/Modal'

  import { setApi } from '/@/api/sys/config'

  export default defineComponent({
    name: 'SetModal',
    components: {
      BasicModal,
      Form,
      FormItem,
      Input,
      InputNumber,
      ATextarea: Textarea,
      ASelect: Select,
      SelectOption,
      Switch,
    },
    props: {
      types: {
        required: true,
        type: Array as PropType<Recordable[]>,
      },
      groups: {
        required: true,
        type: Array as PropType<Recordable[]>,
      },
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowId = ref(0)
      const formRef = ref()
      const isUpdate = ref(false)

      const { createMessage } = useMessage()

      const formParams = reactive({
        group: '',
        type: '',
        name: '',
        title: '',
        extra: '',
        sort: 1,
        status: true,
        remark: '',
      })

      const rules = {
        group: [{ required: true, message: '请选择配置分组', trigger: 'change' }],
        type: [{ required: true, message: '请选择配置类型', trigger: 'change' }],
        name: [
          { required: true, message: '请填写配置别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z1-9_]{1,255}$/,
            message: '只允许填写数字、字母和下划线，1-255个字符',
            trigger: 'blur',
          },
        ],
        title: [
          { required: true, message: '请填写配置标题', trigger: 'blur' },
          { min: 1, max: 255, message: '1-255个字符', trigger: 'blur' },
        ],
      }

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        formRef.value.resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        if (unref(isUpdate)) {
          const { id, group, type, name, title, extra, sort, status, remark } = data.record

          rowId.value = id

          formParams.type = type
          formParams.name = name
          formParams.sort = sort
          formParams.group = group
          formParams.title = title
          formParams.extra = extra
          formParams.remark = remark
          formParams.status = status === 1
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '添加配置' : '编辑配置'))
      const isExtra = computed(() => {
        return (
          formParams.type == 'select' || formParams.type == 'radio' || formParams.type == 'checkbox'
        )
      })

      async function handleSubmit() {
        try {
          await formRef.value.validate()

          if (isExtra.value && !formParams.extra) {
            createMessage.error('请填写选项')
            return
          }

          const params = { ...formParams, status: formParams.status ? 1 : 0 }

          setModalProps({ confirmLoading: true })

          if (unref(rowId) > 0) {
            await setApi.edit(rowId.value, params)
          } else {
            await setApi.create(params)
          }

          setModalProps({ confirmLoading: false })
          closeModal()
          emit('success')
        } catch (err) {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        rules,
        formRef,
        isExtra,
        getTitle,
        formParams,
        handleSubmit,
        registerModal,
      }
    },
  })
</script>
