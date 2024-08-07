<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useFullscreen } from '@vueuse/core'
import { useFileSystemAccess } from '@vueuse/core'
import startCase from 'lodash/startCase'

const { toggle: toggleFullScreen, isFullscreen } = useFullscreen()
const { isSupported: supportsFileSystemAccess } = useFileSystemAccess()
const { $editor, $modal } = useNuxtApp()

type MenuList = {
  label: string
  submenu: Submenu
}[]

type Submenu = {
  label: string
  shortcut?: string
  disabled?: Ref<boolean>
  toggleStateKey?: keyof typeof $editor.config.view
  startsSection?: boolean
  action(): void
}[]

const lacksFileSystemAccess = computed(() => !supportsFileSystemAccess.value)

const menuList: MenuList = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        disabled: lacksFileSystemAccess,
        shortcut: 'ctrl_o',
        action: $editor.openFiles,
      },
      {
        label: 'New',
        shortcut: 'ctrl_n',
        action: $editor.addFile,
      },
      {
        label: 'Save',
        disabled: lacksFileSystemAccess,
        shortcut: 'ctrl_s',
        action() {
          $editor.save({ toFileSystem: true })
        },
      },
      {
        label: 'Config',
        startsSection: true,
        action() {
          $modal.open('config')
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'File Tree',
        shortcut: 'ctrl_shift_f',
        toggleStateKey: 'fileTree',
        action() {
          $editor.setUserConfig('view.fileTree', !$editor.config.view.fileTree)
        },
      },
      {
        label: 'Action Panel',
        shortcut: 'ctrl_shift_a',
        toggleStateKey: 'actionPanel',
        action() {
          $editor.setUserConfig(
            'view.actionPanel',
            !$editor.config.view.actionPanel,
          )
        },
      },
      {
        label: 'Sticky Title',
        startsSection: true,
        toggleStateKey: 'stickyTitle',
        action() {
          $editor.setUserConfig(
            'view.stickyTitle',
            !$editor.config.view.stickyTitle,
          )
        },
      },
      {
        label: 'First-line Indent',
        toggleStateKey: 'indent',
        action() {
          $editor.setUserConfig('view.indent', !$editor.config.view.indent)
        },
      },
      {
        label: 'Full Screen',
        shortcut: 'f11',
        startsSection: true,
        action() {
          toggleFullScreen()
        },
      },
    ],
  },
]

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    /*
      Overwrite browsers' shortcuts.
    */
    if (
      menuList.some((menu) => {
        return menu.submenu.some((submenu) => {
          if (submenu.shortcut) {
            return keys[submenu.shortcut].value
          }
        })
      })
    ) {
      e.preventDefault()
    }
  },
})

menuList.forEach((menu) => {
  menu.submenu.forEach((submenu) => {
    if (submenu.shortcut) {
      whenever(keys[submenu.shortcut], () => {
        submenu.action()
      })
    }
  })
})

const formatShortcut = (shortcut: string) => {
  if (shortcut.match(/f[1-12]/)) {
    return shortcut.toUpperCase()
  }
  return startCase(shortcut).replaceAll(' ', ' + ')
}
</script>

<template>
  <nav
    class="z-20 flex h-[2rem] items-center justify-between bg-orange-gray-900 px-5 text-sm font-semibold text-white"
  >
    <!-- Left -->
    <section class="flex h-full gap-x-2">
      <Menu
        v-for="menu in menuList"
        :key="menu.label"
        class="relative inline-block h-full"
        as="div"
      >
        <MenuButton class="flex h-full items-center gap-x-1 px-2">
          {{ menu.label }} <AngleDownIcon class="opacity-50" />
        </MenuButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform opacity-0"
          enter-to-class="transform opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform opacity-100"
          leave-to-class="transform opacity-0"
        >
          <MenuItems
            class="absolute left-0 origin-top-right overflow-hidden rounded-b bg-blue-gray-100 py-1 text-black focus:outline-none"
          >
            <template v-for="submenu in menu.submenu" :key="submenu.label">
              <!-- New Section Separator -->
              <hr
                v-if="submenu.startsSection"
                class="my-1 h-[1px] text-white/90"
              />

              <!-- Submenu -->
              <MenuItem
                as="button"
                class="flex w-full select-none items-center justify-between gap-x-5 whitespace-nowrap px-3 py-1 text-left font-semibold leading-none"
                @click="submenu.action"
              >
                <span class="flex gap-2">
                  <template
                    v-if="
                      submenu.toggleStateKey &&
                      submenu.toggleStateKey in $editor.config.view
                    "
                  >
                    <CheckIcon
                      v-if="$editor.config.view[submenu.toggleStateKey]"
                      class="w-2.5"
                    />
                    <div v-else class="w-2.5 opacity-60"> - </div>
                  </template>

                  <span :class="{ 'opacity-55': submenu.disabled?.value }">{{
                    submenu.label
                  }}</span>
                </span>

                <span v-if="submenu.shortcut" class="text-xs opacity-60">
                  {{
                    submenu.disabled?.value
                      ? '-'
                      : formatShortcut(submenu.shortcut)
                  }}
                </span>
              </MenuItem>
            </template>
          </MenuItems>
        </transition>
      </Menu>
    </section>

    <!-- Right -->
    <section class="flex items-center gap-x-3">
      <ClientOnly>
        <div
          v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
          class="flex items-center gap-x-3"
        >
          <button
            class="flex h-6 items-center rounded border border-white/20 px-2.5 py-2"
            @click="$pwa?.install()"
          >
            Install
          </button>

          <div class="block h-3 border-l border-l-white" />

          <button
            class="text-white/60"
            @click="$editor.setUserConfig('view.installButton', false)"
          >
            Dismiss
          </button>
        </div>
      </ClientOnly>

      <button class="ml-4" @click="toggleFullScreen">
        <MinimizeIcon v-if="isFullscreen" />
        <MaximizeIcon v-else />
      </button>
    </section>
  </nav>
</template>
