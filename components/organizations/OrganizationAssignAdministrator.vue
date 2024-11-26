<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import InputFile from '@/components/common/file/Input.vue'
import type { FilterOption } from '~/composables/useNotificationAPI'
import { UserType } from '~/types/Administrators'

const props = defineProps<{
  organizationId: string
  onsubmit: (values: any) => void
}>()

const formSchema = toTypedSchema(
  z.object({
    userId: z.string().min(1, 'El usuario es requerido'),
  }),
)
const form = useForm({ validationSchema: formSchema })

const users = ref<Array<{ id: string; firstName: string; lastName: string }>>(
  [],
)

const fetchOrganizationUsers = async () => {
  const userTypeFilter: FilterOption = {
    type: 'equal',
    value: UserType.OrganizationUser,
    field: 'type',
  }
  const organizationFilter: FilterOption = {
    type: 'equal',
    value: props.organizationId,
    field: 'organization.id',
  }
  try {
    const { data } = await useAPI('/user-management/find-administrators', {
      query: {
        filterOptions: JSON.stringify([userTypeFilter, organizationFilter]),
      },
      default: () => [],
    })
    users.value = data.value
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

await fetchOrganizationUsers()

const onSubmit = form.handleSubmit((values: any) => {
  const formattedValues = {
    ...values,
    organizationId: props.organizationId,
  }

  props.onsubmit(formattedValues)
})
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">
      Asignar administrador
    </SheetTitle>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form
      class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5"
      @submit="onSubmit"
    >
      <FormField v-slot="{ componentField }" name="userId">
        <FormItem>
          <FormControl class="w-full">
            <CustomComboboxInput
              label="Usuarios"
              class="w-full truncate"
              :options="
                users.map((e) => ({
                  value: e.id,
                  label: `${e.firstName} ${e.lastName}`,
                }))
              "
              :value="componentField.modelValue"
              @update:model-value="componentField.onChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Botón de Submit -->
      <!-- <Button type="submit">Guardar</Button> -->
      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full',
              !form.meta.value.valid
                ? 'text-primary bg-bgtheme'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ 'Asignar' }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
