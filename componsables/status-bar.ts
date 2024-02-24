const message = ref('')
const timeoutID = ref<NodeJS.Timeout>()
const manualReset = ref<boolean>()

type UseStatusBarMessageArgs = {
  message: string
  duration?: number
  manualReset?: boolean
}

export function useStatusBarMessage(_args?: UseStatusBarMessageArgs) {
  const resetStatusBarMessage = () => {
    message.value = ''
    timeoutID.value = undefined
    manualReset.value = undefined
  }

  const setStatusBarMessage = (args: UseStatusBarMessageArgs) => {
    if (timeoutID.value) {
      clearTimeout(timeoutID.value)
    }

    message.value = args.message
    manualReset.value = args.manualReset

    if (!args.manualReset) {
      timeoutID.value = setTimeout(
        resetStatusBarMessage,
        (args.duration || 3) * 1000,
      )
    }
  }

  /*
    A setStatusBarMessage() shortcut through
    the composable's arguments.
  */
  if (_args) {
    setStatusBarMessage(_args)
  }

  return {
    setStatusBarMessage,
    resetStatusBarMessage,
    message,
    manualReset,
  }
}
