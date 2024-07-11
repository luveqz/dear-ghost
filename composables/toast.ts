import type { MODALS_AND_MENUS } from '@/stores/modal'

const DEFAULT_ICON = 'warning'
const DEFAULT_CTA_TEXT = 'Help'
type Icon = 'unplug' | 'warning'

const message = ref('')
const timeoutID = ref<NodeJS.Timeout>()
const icon = ref<Icon>(DEFAULT_ICON)
const seeMoreModalId = ref<keyof typeof MODALS_AND_MENUS>()
const ctaText = ref<string>()

type UseToastArgs = {
  message: string
  duration?: number
  icon?: Icon
  seeMoreModalId?: keyof typeof MODALS_AND_MENUS
  ctaText?: string
}

export function useToast(_args?: UseToastArgs) {
  const setToast = (args: UseToastArgs) => {
    if (timeoutID.value) {
      clearTimeout(timeoutID.value)
    }

    message.value = args.message
    seeMoreModalId.value = args.seeMoreModalId
    icon.value = args?.icon || DEFAULT_ICON
    ctaText.value = args?.ctaText || DEFAULT_CTA_TEXT

    timeoutID.value = setTimeout(
      () => {
        message.value = ''
        timeoutID.value = undefined
        icon.value = DEFAULT_ICON
        seeMoreModalId.value = undefined
        ctaText.value = undefined
      },
      (args.duration || 3) * 1000,
    )
  }

  /*
    A setToast() shortcut through
    the composable's arguments.
  */
  if (_args) {
    setToast(_args)
  }

  return {
    setToast,
    message,
    icon,
    seeMoreModalId,
    ctaText,
  }
}
