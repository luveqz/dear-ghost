import { save, open } from '@tauri-apps/api/dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs'
import { defineStore } from 'pinia'

import { useToast } from '@/componsables/toast'
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
      },
    }) as {
      files: TextFile[]
      activeFile: TextFile | null
      mode: 'write' | 'edit-prompts'
      view: {
        fileTree: boolean
        actionPanel: boolean
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

    async openFile() {
      try {
        const selectedPath = await open({
          multiple: false,
          title: 'Open text file',
          filters: [
            {
              name: 'Markdown File',
              extensions: ['md'],
            },
          ],
        })

        if (typeof selectedPath === 'string') {
          const content = await readTextFile(selectedPath)

          const newFile = this.addFile()
          newFile.id = selectedPath
          newFile.data.content = content
          this.save()
        }
      } catch (err) {
        useToast({ message: 'Could not open file.' })
      }
    },

    save({ toFileSystem = false } = {} as { toFileSystem: boolean }) {
      if (this.validate(this.files)) {
        if (window.__TAURI__ && toFileSystem) {
          this._saveToFileSystem()
        } else {
          this._saveToLocalStorage()
        }
      }
    },

    async _saveToFileSystem() {
      if (!this.activeFile) return

      if (this.activeFile.id.includes(DEFAULT_FILE.id)) {
        try {
          const selectedPath = await save({
            defaultPath: `$HOME/${this.activeFile.data.title}.md`,
            filters: [
              {
                name: 'Markdown File',
                extensions: ['md'],
              },
            ],
          })

          if (selectedPath) {
            this.activeFile.id = selectedPath
            writeTextFile(selectedPath, this.activeFile.data.content)
            this._saveToLocalStorage()
          }
        } catch (err) {
          useToast({ message: 'Could not open file.' })
        }
      } else {
        writeTextFile(this.activeFile.id, this.activeFile.data.content)
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
      if (window.__TAURI__) {
        this._loadFromLocalStorage()
        return await this._syncWithFileSystem()
      } else {
        return this._loadFromLocalStorage()
      }
    },

    async _syncWithFileSystem() {
      await Promise.all(
        this.files.map(async (file: TextFile) => {
          if (!this._isUnsavedFile(file)) {
            const content = await readTextFile(file.id)
            file.data.content = content
          }
        }),
      )
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
