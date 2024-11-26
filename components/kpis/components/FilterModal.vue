<template>
  <form @submit="onSubmit">
    <div class="flex flex-col gap-2 flex-grow p-5">
      <FormField
        v-if="globalType === GlobalType.Platform"
        v-slot="{ componentField }"
        name="organizations"
      >
        <FormItem>
          <FormControl class="w-full">
            <CustomComboboxInput
              label="Organizaciones"
              class="w-full truncate"
              :options="formattedOrganizations"
              :multiple="true"
              :value="componentField.modelValue"
              @update:model-value="
                (value) => {
                  componentField.onChange(value)
                }
              "
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
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

      <div
        v-if="form.values.monthSelect === MonthSelect.RangeOfMonths"
        class="flex gap-2"
      >
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
          Limpiar
        </Button>
        <Button class="w-full" type="submit"> Aplicar </Button>
      </div>
    </SheetFooter>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { MonthSelect, monthSelectMap } from './month-select'
import { filterFormSchema, type FilterFormSchema } from './filter-form-schema'
import Button from '~/components/ui/button/Button.vue'
import type { Organization } from '~/models/organizations'
import { GlobalType } from '~/types/Common'
const { globalType } = useUserSessionExtended()

const props = defineProps<{
  initialFormValues: FilterFormSchema
  organizations: Organization[]
  onSubmit: (values: FilterFormSchema) => void
}>()

const form = useForm({
  validationSchema: toTypedSchema(filterFormSchema),
})

const formattedOrganizations = computed(() => {
  return props.organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }))
})

console.log(
  `FilterModal props.initialFormValues: ${JSON.stringify(props.initialFormValues)}`,
)
form.setValues(props.initialFormValues)
const onSubmit = form.handleSubmit((values) => {
  console.log('FilterModal onSubmit')
  props.onSubmit(values)
})

const handleClear = () => {}
</script>
