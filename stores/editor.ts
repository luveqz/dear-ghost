import { defineStore } from 'pinia'
import { TextFile } from '@/lib/types/editor'
import { deepCopy } from '@/lib/utils/copy'

const FILE_STORAGE_KEY = 'files-storage'

const DEFAULT_FILE: TextFile = {
  id: 1,
  data: {
    title: 'Untitled',
    content: '',
  },
}

export const useEditorStore = defineStore('editor', {
  state: () =>
    ({
      files: [],
      mode: 'write',
    }) as {
      files: TextFile[]
      mode: 'write' | 'edit-workspace'
    },

  actions: {
    validate(file: any) {
      // validate array with a Joi schema
      return true
    },

    addFile() {
      const id = Math.floor(new Date().getTime())
      this.files.push({ ...deepCopy(DEFAULT_FILE), id })
    },

    save() {
      if (this.validate(this.files)) {
        const plainWidgetData = this.files.map((file) => {
          const { editor, ...rest } = file
          return rest
        })

        window.localStorage.setItem(
          FILE_STORAGE_KEY,
          JSON.stringify(plainWidgetData),
        )
      }
    },

    load() {
      const files = JSON.parse(
        window.localStorage.getItem(FILE_STORAGE_KEY) || '[]',
      )

      if (this.validate(files)) {
        this.files = files.length ? files : [DEFAULT_FILE]
        return this.files
      }
      return false
    },
  },
})
