<script lang="tsx" setup>
import Card from '~/design-system/ui/card/Card.vue'
import CardHeader from '~/design-system/ui/card/CardHeader.vue'
import CardTitle from '~/design-system/ui/card/CardTitle.vue'

export type BerlinSimpleCardProps = {
  title?: string
}

withDefaults(defineProps<BerlinSimpleCardProps>(), {
  title: 'Card Title',
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Card Content on slot -->
      <slot />
    </CardContent>
  </Card>
</template>
