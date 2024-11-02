<script setup lang="ts">
import { usePreferredDark, useFavicon } from '@vueuse/core'
import { computed } from 'vue'

const isDark = usePreferredDark()
const favicon = computed(() => (isDark.value ? 'dark.ico' : 'light.ico'))
useFavicon(favicon)
</script>
