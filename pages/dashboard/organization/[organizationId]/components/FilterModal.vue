<template>
  <SheetContent
    v-model:open="isSheetOpen"
    side="right"
    class="flex flex-col h-full"
    @pointer-down-outside="(e) => e.preventDefault()"
    @interact-outside="(e) => e.preventDefault()"
  >
    <SheetHeader>
      <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
        <X class="w-4 h-4 text-muted-foreground" />
      </SheetClose>
      <SheetTitle class="text-xl font-medium text-[#64748B]">
        Filtro
      </SheetTitle>
    </SheetHeader>
    <form @submit="onSubmit">
      <div class="flex flex-col gap-2 flex-grow p-5">
        <FormField v-slot="{ componentField }" name="monthSelect">
          <FormItem class="w-full">
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                :items="
                  Object.values(MonthSelect).map((item) => ({
                    id: item,
                    name: monthSelectMap[item].label,
                  }))
                "
                placeholder="Mes"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="rangeStart">
            <FormItem class="w-1/2">
              <FormControl>
                <DateInput
                  class="my-2"
                  label="Fecha de inicio"
                  :value="componentField.modelValue"
                  @update:model-value="componentField.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="rangeEnd">
            <FormItem class="w-1/2">
              <FormControl>
                <DateInput
                  class="my-2"
                  label="Fecha de fin"
                  :value="componentField.modelValue"
                  @update:model-value="componentField.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
      <SheetFooter class="mt-auto">
        <div class="border-t flex justify-between gap-2">
          <Button class="w-full" variant="outline" @click="handleClear">
            Limpiaras
          </Button>
          <Button class="w-full" type="submit"> Aplicar </Button>
        </div>
      </SheetFooter>
    </form>
  </SheetContent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { MonthSelect, monthSelectMap } from './month-select'
import { filterFormSchema, type FilterFormSchema } from './filter-form-schema'
import SheetContent from '~/components/ui/sheet/SheetContent.vue'
import Button from '~/components/ui/button/Button.vue'
import DialogClose from '~/components/ui/dialog/DialogClose.vue'

const props = defineProps<{
  initialFormValues: FilterFormSchema
  onSubmit: (values: FilterFormSchema) => void
}>()
const isSheetOpen = ref(false)

// <as

const form = useForm({
  validationSchema: toTypedSchema(filterFormSchema),
})

const onSubmit = form.handleSubmit((values) => {
  console.log('FilterModal onSubmit')
  props.onSubmit(values)
})

const handleClear = () => {}

onMounted(() => {
  form.setValues(props.initialFormValues)
})
</script>
