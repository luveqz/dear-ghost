const DEFAULT_ICON = 'warning'
type Icon = 'unplug' | 'warning'

const message = ref('')
const timeoutID = ref<NodeJS.Timeout>()
const icon = ref<Icon>(DEFAULT_ICON)

type UseToastArgs = {
  message: string
  duration?: number
  icon?: Icon
}

export function useToast(_args?: UseToastArgs) {
  const setToast = (args: UseToastArgs) => {
    if (timeoutID.value) {
      clearTimeout(timeoutID.value)
    }

    message.value = args.message
    icon.value = args?.icon || DEFAULT_ICON

    timeoutID.value = setTimeout(
      () => {
        message.value = ''
        timeoutID.value = undefined
        icon.value = DEFAULT_ICON
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
  }
}
