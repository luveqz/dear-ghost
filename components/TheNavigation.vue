<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useFullscreen } from '@vueuse/core'
import { appWindow } from '@tauri-apps/api/window'
import startCase from 'lodash/startCase'

const { toggle: toggleFullScreen } = useFullscreen()

const { $editor } = useNuxtApp()

type MenuList = {
  label: string
  submenu: Submenu
}[]

type Submenu = {
  label: string
  shortcut?: string
  toggleStateKey?: keyof typeof $editor.view
  startsSection?: boolean
  action(): void
}[]

const menuList: MenuList = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        shortcut: 'ctrl_o',
        action: $editor.openFile,
      },
      {
        label: 'New',
        shortcut: 'ctrl_n',
        action: $editor.addFile,
      },
      {
        label: 'Save',
        shortcut: 'ctrl_s',
        action() {
          $editor.save({ toFileSystem: true })
        },
      },
      {
        label: 'Exit',
        shortcut: 'ctrl_q',
        startsSection: true,
        action() {
          appWindow.close()
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
          $editor.view.fileTree = !$editor.view.fileTree
        },
      },
      {
        label: 'Action Panel',
        shortcut: 'ctrl_shift_a',
        toggleStateKey: 'actionPanel',
        action() {
          $editor.view.actionPanel = !$editor.view.actionPanel
        },
      },
      {
        label: 'Sticky Title',
        toggleStateKey: 'stickyTitle',
        action() {
          $editor.view.stickyTitle = !$editor.view.stickyTitle
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
                      submenu.toggleStateKey in $editor.view
                    "
                  >
                    <CheckIcon
                      v-if="$editor.view[submenu.toggleStateKey]"
                      class="w-2.5"
                    />
                    <div v-else class="w-2.5 opacity-60"> - </div>
                  </template>

                  {{ submenu.label }}
                </span>

                <span v-if="submenu.shortcut" class="text-xs opacity-60">
                  {{ formatShortcut(submenu.shortcut) }}
                </span>
              </MenuItem>
            </template>
          </MenuItems>
        </transition>
      </Menu>
    </section>

    <!-- Right -->
    <section class="flex items-center gap-x-5">
      <button
        :class="{ 'opacity-50': $editor.mode !== 'write' }"
        @click="$editor.mode = 'write'"
      >
        Write
      </button>
      <div class="block h-3 border-l border-l-white" />
      <button
        :class="{ 'opacity-50': $editor.mode !== 'edit-prompts' }"
        @click="$editor.mode = 'edit-prompts'"
      >
        Edit Prompts
      </button>
    </section>
  </nav>
</template>
