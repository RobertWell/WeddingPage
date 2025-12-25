<template>
  <footer class="py-8 bg-ink/5 text-center">
    <div class="container mx-auto px-4">
      <p class="text-sm text-ink/60">
        {{ t('footer.text') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
