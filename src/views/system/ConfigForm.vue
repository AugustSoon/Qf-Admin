<template>
  <Form :model="formParams" :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }">
    <template v-for="item in formParams" :key="item.id">
      <FormItem :label="item.title">
        <template v-if="item.type == 'number'">
          <InputNumber v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'textarea'">
          <ATextarea v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'password'">
          <InputPassword v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'select'">
          <ASelect v-model:value="item.value">
            <SelectOption v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </SelectOption>
          </ASelect>
        </template>
        <template v-else-if="item.type == 'radio'">
          <ARadioGroup name="item.name" v-model:value="item.value">
            <ARadio v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </ARadio>
          </ARadioGroup>
        </template>
        <template v-else-if="item.type == 'checkbox'">
          <ACheckboxGroup v-model:value="item.value">
            <ACheckbox v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </ACheckbox>
          </ACheckboxGroup>
        </template>
        <template
          v-else-if="
            item.type == 'oneimage' ||
            item.type == 'multipleimage' ||
            item.type == 'onefile' ||
            item.type == 'multiplefile'
          "
        >
          <CustomUpload
            v-model:value="item.value"
            :multiple="item.type == 'multipleimage' || item.type == 'multiplefile'"
            :accept="item.type == 'oneimage' || item.type == 'multipleimage' ? 'image' : 'all'"
            :listType="item.type == 'oneimage' || item.type == 'multipleimage' ? 'picture' : 'text'"
          />
        </template>
        <template v-else>
          <Input v-model:value="item.value" />
        </template>
      </FormItem>
    </template>
    <FormItem v-auth="'system.config.store'" :wrapper-col="{ span: 8, offset: 2 }">
      <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
    </FormItem>
  </Form>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, onMounted } from 'vue'
  import {
    Form,
    FormItem,
    Input,
    InputNumber,
    InputPassword,
    Textarea,
    Select,
    SelectOption,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
  } from 'ant-design-vue'

  import CustomUpload from './CustomUpload.vue'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { configApi } from '/@/api/sys/config'

  export default defineComponent({
    name: 'ConfigForm',
    components: {
      Form,
      FormItem,
      Input,
      InputNumber,
      InputPassword,
      ATextarea: Textarea,
      ASelect: Select,
      SelectOption,
      ARadioGroup: RadioGroup,
      ARadio: Radio,
      ACheckboxGroup: CheckboxGroup,
      ACheckbox: Checkbox,
      CustomUpload,
    },
    props: {
      group: {
        type: String,
        required: true,
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
    setup(props) {
      const loading = ref(false)
      const { group } = toRefs(props)
      const { createMessage } = useMessage()
      const formParams = ref<Recordable[]>([])

      async function getConfig() {
        try {
          const data = await configApi.list({ group: group.value })

          formParams.value = data
        } catch (err) {
          console.log('err: ', err)
        }
      }

      async function handleSubmit() {
        loading.value = true

        try {
          const data = formParams.value.map((item: Recordable) => {
            const isUpload =
              item.type === 'oneimage' ||
              item.type === 'multipleimage' ||
              item.type === 'onefile' ||
              item.type === 'multiplefile'

            return {
              id: item.id,
              type: item.type,
              value: isUpload
                ? item.value.map((one: Recordable) => {
                    return {
                      name: one.name,
                      path: one.path,
                    }
                  })
                : item.value,
            }
          })

          await configApi.update({ data })

          loading.value = false
          createMessage.success('保存成功')
        } catch (err) {
          loading.value = false
        }
      }

      onMounted(() => {
        getConfig()
      })

      return {
        loading,
        formParams,
        handleSubmit,
      }
    },
  })
</script>
