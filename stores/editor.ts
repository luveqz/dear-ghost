import { defineStore } from 'pinia'

import { TextFile } from '@/lib/types/editor'
import { deepCopy } from '@/lib/utils/copy'

const FILE_STORAGE_KEY = 'files-storage'

export const DEFAULT_FILE: TextFile = {
  id: '92f98faa648882aa943e9fe790fbc2bd',
  data: {
    title: 'Untitled',
    content: '',
  },
}

export const useEditorStore = defineStore('editor', {
  state: () =>
    ({
      files: [],
      activeFile: null,
      mode: 'edit-prompts',
      view: {
        fileTree: false,
        actionPanel: true,
        stickyTitle: false,
      },
    }) as {
      files: TextFile[]
      activeFile: TextFile | null
      mode: 'write' | 'edit-prompts'
      view: {
        fileTree: boolean
        actionPanel: boolean
        stickyTitle: boolean
      }
    },

  actions: {
    validate(file: any) {
      // validate array with a Joi schema
      return true
    },

    addFile() {
      const id = `${DEFAULT_FILE.id}-${Math.floor(new Date().getTime())}`
      const newFile: TextFile = { ...deepCopy(DEFAULT_FILE), id }
      this.files.push(newFile)
      this.activeFile = newFile
      return newFile
    },

    removeFile(file: TextFile) {
      const fileIndex = this.files.findIndex((file_) => file_.id === file.id)
      this.files.splice(fileIndex, 1)
      this.save()
    },

    save() {
      if (this.validate(this.files)) {
        this._saveToLocalStorage()
      }
    },

    _saveToLocalStorage() {
      const plainWidgetData = this.files.map((file) => {
        const { editor, ...rest } = file
        return rest
      })

      window.localStorage.setItem(
        FILE_STORAGE_KEY,
        JSON.stringify(plainWidgetData),
      )
    },

    async load() {
      return this._loadFromLocalStorage()
    },

    _loadFromLocalStorage() {
      const files = JSON.parse(
        window.localStorage.getItem(FILE_STORAGE_KEY) || '[]',
      )

      if (this.validate(files)) {
        this.files = files.length ? files : [deepCopy(DEFAULT_FILE)]
        return this.files
      }
      return false
    },

    _isUnsavedFile(file: TextFile) {
      return file.id.includes(DEFAULT_FILE.id)
    },
  },
})
