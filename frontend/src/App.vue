<template>
  <div class="min-h-screen">
    <!-- Leaf pattern background -->
    <div class="leaf-pattern"></div>

    <!-- Main content -->
    <AppHeader />
    <main>
      <HeroSection />
      <CoupleSection />
      <LocationSection />
      <RSVPSection />
      <InvitationSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import CoupleSection from '@/components/CoupleSection.vue'
import LocationSection from '@/components/LocationSection.vue'
import RSVPSection from '@/components/RSVPSection.vue'
import InvitationSection from '@/components/InvitationSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()

onMounted(() => {
  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0')
        entry.target.classList.remove('opacity-0', 'translate-y-4')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700')
    observer.observe(el)
  })
})
</script>
