import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'
import TurndownService from 'turndown'

import type { TextFile } from '@/lib/types/editor'
import { useToast } from '@/componsables/toast'
import { deepCopy } from '@/lib/utils/copy'
import { makeId } from '@/lib/utils/random'

const FILE_STORAGE_KEY = 'files-storage'

export const DEFAULT_FILE: TextFile = {
  id: '92f98faa648882aa943e9fe790fbc2bd',
  data: {
    title: 'Untitled',
    content: '',
  },
}

const turndownService = new TurndownService()

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

    async openFile() {
      try {
        const [fileHandle] = await window.showOpenFilePicker()

        // If already opened, just focus it.
        for (let file of this.files) {
          if (file.handle && (await fileHandle.isSameEntry(file.handle))) {
            this.activeFile = file
            return
          }
        }

        const content = await (await fileHandle.getFile()).text()
        const newFile = this.addFile()
        newFile.id = makeId(60)
        newFile.data.content = content
        newFile.handle = fileHandle
        newFile.data.title = fileHandle.name
        newFile.data.title = fileHandle.name

        this._saveToIndexedDB()
      } catch ({ message }: any) {
        if (message === 'The user aborted a request.') {
          return
        }
        useToast({ message: 'Could not open file.' })
      }
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
      this._saveAllToIndexedDB()
    },

    save({ toFileSystem = false } = {} as { toFileSystem: boolean }) {
      if (this.validate(this.files)) {
        if (toFileSystem) {
          this._saveToFileSystem()
        } else {
          this._saveToIndexedDB()
        }
      }
    },

    async _saveToFileSystem() {
      if (!this.activeFile) return

      // Unsaved file.
      if (this.activeFile.id.includes(DEFAULT_FILE.id)) {
        try {
          const newHandle = await window.showSaveFilePicker({
            suggestedName: `${this.activeFile.data.title}.md`,
          })

          const writable = await newHandle.createWritable()
          await writable.write(
            turndownService.turndown(this.activeFile.data.content),
          )
          await writable.close()

          this.activeFile.id = makeId(60)
          this.activeFile.data.title = newHandle.name
          this._saveToIndexedDB()
        } catch (err) {
          useToast({ message: 'Could not save file.' })
        }

        return
      }

      // Saved file.
      if (
        (await this.activeFile.handle?.requestPermission({
          mode: 'readwrite',
        })) === 'granted'
      ) {
        const writable = await (
          this.activeFile!.handle as FileSystemFileHandle
        ).createWritable()
        await writable.write(
          turndownService.turndown(this.activeFile.data.content),
        )
        await writable.close()

        this._saveToIndexedDB()
        return
      } else {
        useToast({ message: 'Could not save file.' })
      }
    },

    async _saveToIndexedDB() {
      if (!this.activeFile) return
      const { editor, ...activeFile } = this.activeFile

      const files = await this._loadFromIndexedDB()
      const activeIndex = files.findIndex(
        (file: TextFile) => file.id === activeFile.id,
      )

      const plainFile = {
        ...activeFile,
        data: toRaw(activeFile.data),
        handle: toRaw(activeFile.handle),
      }

      // If the file exists, update it.
      if (activeIndex !== -1) {
        files.splice(activeIndex, 1, plainFile)

        // If the file doesn't exist, insert it.
      } else {
        files.push(plainFile)
      }

      set(FILE_STORAGE_KEY, files)
    },

    _saveAllToIndexedDB() {
      const plainWidgetData = this.files.map((file) => {
        const { editor, ...rest } = file
        rest.data = toRaw(rest.data)
        rest.handle = toRaw(rest.handle)
        return rest
      })

      set(FILE_STORAGE_KEY, plainWidgetData)
    },

    async load() {
      this.files = await this._loadFromIndexedDB()
    },

    async _loadFromIndexedDB() {
      let files = (await get(FILE_STORAGE_KEY)) || []

      if (this.validate(files)) {
        files = files.length ? files : [deepCopy(DEFAULT_FILE)]
      } else {
        files = [deepCopy(DEFAULT_FILE)]
      }

      return files as TextFile[]
    },

    _isUnsavedFile(file: TextFile) {
      return file.id.includes(DEFAULT_FILE.id)
    },
  },
})
