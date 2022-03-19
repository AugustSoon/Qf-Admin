<template>
  <Upload
    :action="uploadUrl"
    :headers="uploadHeaders"
    :multiple="multiple"
    :accept="accepts"
    :listType="listType"
    :fileList="fileList"
    @change="handleChange"
  >
    <a-button>上传</a-button>
  </Upload>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, reactive, computed } from 'vue'

  import { Upload } from 'ant-design-vue'

  import { useGlobSetting } from '/@/hooks/setting'
  import { getToken } from '/@/utils/auth'

  interface FileItem {
    uid: string
    url: string
    name: string
    path?: string
    status?: string
    response?: Recordable
  }

  interface FileInfo {
    file: FileItem
    fileList: FileItem[]
  }

  export default defineComponent({
    name: 'CustomUpload',
    components: { Upload },
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      listType: {
        type: String as PropType<'text' | 'picture'>,
        default: 'text',
      },
      accept: {
        type: String,
        default: 'all',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      const { value, accept, multiple } = toRefs(props)

      const initList = value.value.map((item: Recordable, index) => {
        return {
          uid: `${index}`,
          status: 'done',
          url: item.url,
          path: item.path,
          name: item.name,
        }
      })

      const fileList = ref<FileItem[]>(initList as FileItem[])

      const accepts = computed(() => {
        if (accept.value == 'image') {
          return '.png,.jpg,.jpeg,.gif,.webp,.bmp'
        } else {
          return '*'
        }
      })

      const globSetting = useGlobSetting()
      const apiUrl = `${globSetting.apiUrl}${globSetting.urlPrefix}`
      const uploadUrl = `${apiUrl}/upload`
      const uploadHeaders = reactive({ authorization: `Bearer ${getToken()}` })

      function handleChange(info: FileInfo) {
        let resFileList = [...info.fileList]

        if (!multiple.value) resFileList = resFileList.slice(-1)

        resFileList = resFileList.map((file) => {
          if (file.response) {
            const { data } = file.response
            file.url = data.url
            file.path = data.path
          }
          return file
        })

        fileList.value = resFileList

        emit(
          'update:value',
          resFileList.map((item) => {
            return {
              url: item.url,
              name: item.name,
              path: item.path,
            }
          }),
        )
      }

      return {
        accepts,
        fileList,
        uploadUrl,
        uploadHeaders,
        handleChange,
      }
    },
  })
</script>
