import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'

import type { TextFile } from '@/lib/types/editor'
import { useToast } from '@/composables/toast'
import { deepCopy } from '@/lib/utils/copy'
import { makeId } from '@/lib/utils/random'
import { htmlToMarkdown, markdownToHtml } from '@/lib/utils/parse'
import { useFileSystemAccess } from '@vueuse/core'
import { useStatusBarMessage } from '@/composables/status-bar'

const FILE_STORAGE_KEY = 'files-storage'

export const DEFAULT_FILE: TextFile = {
  id: 'default-faa648882aa943e9fe790fbc2bd',
  data: {
    title: 'Untitled',
    content: '',
  },
  isSaved: true,
}

export const useEditorStore = defineStore('editor', {
  state: () =>
    ({
      loading: true,
      files: [],
      activeFile: null,
      showInstallButton: false,
      showPromptsTabScrollIndicator: false,
      providerConfig: {
        anthropic: {
          apiKey: '',
        },
        lmStudio: {
          port: '1234',
        },
        ollama: {
          host: 'http://localhost:11434',
        },
      },
      view: {
        fileTree: false,
        actionPanel: true,
        stickyTitle: false,
        indent: true,
      },
    }) as {
      loading: boolean
      files: TextFile[]
      activeFile: TextFile | null
      showInstallButton: boolean
      showPromptsTabScrollIndicator: boolean
      providerConfig: {
        anthropic: {
          apiKey: string
        }
        lmStudio: {
          port: string
        }
        ollama: {
          host: string
        }
      }
      view: {
        fileTree: boolean
        actionPanel: boolean
        stickyTitle: boolean
        indent: boolean
      }
    },

  actions: {
    validate(file: any) {
      // validate array with a Joi schema
      return true
    },

    async openFiles() {
      try {
        const fileHandles = await window.showOpenFilePicker({ multiple: true })

        for (let fileHandle of fileHandles) {
          await this.openFile(fileHandle)
        }
      } catch ({ message }: any) {
        if (message === 'The user aborted a request.') {
          return
        }
        const { isSupported } = useFileSystemAccess()

        if (!isSupported.value) {
          useToast({
            message:
              "Your browser doesn't support this action. Try an updated Google Chrome.",
            duration: 5,
          })
          return
        }

        useToast({ message: 'Could not open file.' })
      }
    },

    async openFile(fileHandle: FileSystemFileHandle) {
      await fileHandle.requestPermission({
        mode: 'read',
      })

      // If already opened, just focus it.
      for (let file of this.files) {
        if (file.handle && (await fileHandle.isSameEntry(file.handle))) {
          this.activeFile = file
          return
        }
      }

      const content = await (await fileHandle.getFile()).text()
      const parsedContent = await markdownToHtml(content)

      /* 
        If there is only an empty file, replace it
        with the opened one. 
      */
      if (this.files.length === 1) {
        const file = this.files[0] as TextFile

        if (
          !file.handle &&
          (!file.data.content || file.data.content === '<p></p>')
        ) {
          await this.removeFile(file)
        }
      }

      const newFile = this.addFile()
      newFile.id = makeId(60)
      newFile.handle = fileHandle
      newFile.data.title = fileHandle.name
      newFile.data.content = parsedContent

      return await this._saveToIndexedDB({ isSaved: true })
    },

    addFile() {
      const id = makeId(60)
      const newFile: TextFile = { ...deepCopy(DEFAULT_FILE), id }
      this.files.push(newFile)
      this.activeFile = newFile
      return newFile
    },

    async removeFile(file: TextFile) {
      const fileIndex = this.files.findIndex((file_) => file_.id === file.id)
      this.files.splice(fileIndex, 1)

      return this._saveAllToIndexedDB()
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
      if (!this.activeFile.handle) {
        try {
          const newHandle = await window.showSaveFilePicker({
            suggestedName: `${this.activeFile.data.title}.md`,
          })

          const writable = await newHandle.createWritable()
          await writable.write(htmlToMarkdown(this.activeFile.data.content))
          await writable.close()

          this.activeFile.data.title = newHandle.name
          this.activeFile.handle = newHandle
          this._saveToIndexedDB({ isSaved: true })

          useStatusBarMessage({ message: 'File saved.' })
          return
        } catch (err) {
          const { isSupported } = useFileSystemAccess()

          if (!isSupported.value) {
            useToast({
              message:
                "Your browser doesn't support this action. Try an updated Google Chrome.",
              duration: 5,
            })
            return
          }

          useToast({ message: 'Could not save file.' })
        }
      }

      // Saved file.
      if (
        (await this.activeFile.handle?.requestPermission({
          mode: 'readwrite',
        })) === 'granted'
      ) {
        const writable = await this.activeFile!.handle!.createWritable()
        await writable.write(htmlToMarkdown(this.activeFile.data.content))
        await writable.close()

        this._saveToIndexedDB({ isSaved: true })

        useStatusBarMessage({ message: 'File saved.' })
        return
      } else {
        const { isSupported } = useFileSystemAccess()

        if (!isSupported.value) {
          useToast({
            message:
              "Your browser doesn't support this action. Try an updated Google Chrome.",
            duration: 5,
          })
          return
        }

        useToast({ message: 'Could not save file.' })
      }
    },

    async _saveToIndexedDB({ isSaved } = {} as { isSaved: boolean }) {
      if (!this.activeFile) return
      this.activeFile.isSaved = isSaved
      const { editor, ...activeFile } = this.activeFile

      /*
        We only want to save the activeFile's changes. So,
        instead of this.files (which might include unsaved
        changes in other files), we use an already saved
        snapshot of our files and patch it with the 
        activeFile's changes.
      */
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

      return set(FILE_STORAGE_KEY, files)
    },

    async _saveAllToIndexedDB() {
      const plainWidgetData = this.files.map((file) => {
        const { editor, ...rest } = file
        rest.data = toRaw(rest.data)
        rest.handle = toRaw(rest.handle)
        return rest
      })

      await set(FILE_STORAGE_KEY, plainWidgetData)
    },

    async load() {
      await this.loadUserConfig()
      this.loading = false

      this.files = await this._loadFromIndexedDB({ addDefault: true })
      await this._syncWithFileSystem()
      await this.focusLastActiveFile()
    },

    async _loadFromIndexedDB({ addDefault } = {} as { addDefault: boolean }) {
      let files = (await get(FILE_STORAGE_KEY)) || []

      if (!this.validate(files)) {
        files = []
      }

      if (addDefault) {
        files = files.length ? files : [deepCopy(DEFAULT_FILE)]
      }

      return files as TextFile[]
    },

    async _syncWithFileSystem() {
      const newFiles = []

      // 1. Update allowed files.
      for (let file of this.files) {
        if (!file.handle) continue

        if (
          (await file.handle?.queryPermission({ mode: 'read' })) === 'granted'
        ) {
          await this.parseFileContent(file as TextFile)
        } else {
          newFiles.push(file)
        }
      }

      // 2. Request permission for new files.
      if (newFiles.length) {
        await this.requestReadPermission(newFiles as TextFile[])
      }

      // 3. If no files left, add a new one.
      if (!this.files.length) {
        this.addFile()
      }
    },

    async requestReadPermission(newFiles: TextFile[]) {
      const { $modal } = useNuxtApp()

      $modal.open(
        'confirm-read-permission',
        async ({ abort } = { abort: false } as { abort: boolean }) => {
          if (abort) {
            for (let file of newFiles) {
              await this.removeFile(file as TextFile)
            }

            if (!this.files.length) {
              this.addFile()
            }
            return
          }

          if (
            (await newFiles[0].handle?.requestPermission({ mode: 'read' })) ===
            'granted'
          ) {
            for (let file of newFiles) {
              this.parseFileContent(file as TextFile)
            }
          }
        },
      )
    },

    async parseFileContent(file: TextFile) {
      if (!file.handle) return
      const content = await (await file.handle.getFile()).text()
      const parsedContent = await markdownToHtml(content)
      file.data.content = parsedContent
    },

    _isUnsavedFile(file: TextFile) {
      return file.id.includes(DEFAULT_FILE.id)
    },

    setUserConfig({ showInstallButton }: { showInstallButton: boolean }) {
      this.showInstallButton = showInstallButton
      set('show-install-button', showInstallButton)
    },

    setShowInstallButton(show: boolean) {
      this.showInstallButton = show
      set('show-install-button', show)
    },

    setShowFileTree(show: boolean) {
      this.view.fileTree = show
      set('show-file-tree', show)
    },

    setShowActionPanel(show: boolean) {
      this.view.actionPanel = show
      set('show-action-panel', show)
    },

    setShowIndent(show: boolean) {
      this.view.indent = show
      set('show-indent', show)
    },

    setShowPromptsTabScrollIndicator(show: boolean) {
      this.showPromptsTabScrollIndicator = show
      set('show-prompts-tab-scroll-indicator', show)
    },

    saveProviderConfig() {
      set('provider-config', toRaw(this.providerConfig))
    },

    async loadUserConfig() {
      const showFileTree = await get('show-file-tree')
      const showActionPanel = await get('show-action-panel')
      const showInstallButton = await get('show-install-button')
      const showIndent = await get('show-indent')
      const showPromptsTabScrollIndicator = await get(
        'show-prompts-tab-scroll-indicator',
      )
      const providerConfig = await get('provider-config')

      this.view.fileTree = showFileTree !== undefined ? showFileTree : false

      this.view.actionPanel =
        showActionPanel !== undefined ? showActionPanel : true

      this.view.indent = showIndent !== undefined ? showIndent : true

      this.showInstallButton =
        showInstallButton !== undefined ? showInstallButton : true

      this.showPromptsTabScrollIndicator =
        showPromptsTabScrollIndicator !== undefined
          ? showPromptsTabScrollIndicator
          : true

      this.providerConfig =
        providerConfig !== undefined ? providerConfig : this.providerConfig
    },

    async setActiveFile(file: TextFile) {
      this.activeFile = file
      set('last-active-file-id', file.id)
    },

    async focusLastActiveFile() {
      const lastActiveFileId = await get('last-active-file-id')

      if (lastActiveFileId) {
        const file = this.files.find((file) => file.id === lastActiveFileId)

        if (file) {
          this.activeFile = file
          return
        }
      }
      this.setActiveFile(this.files[0] as TextFile)
    },
  },
})
