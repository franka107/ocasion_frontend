<template>
    <SelectRoot v-model:open="open">
        <SelectTrigger>
            <span>
                {{ currentLabel || props.placeholder }} 
            </span>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <li
                tabindex="-1"
                class="relative flex w-full select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                v-for="item in items"
                :key="item.id"
                @click="handleSelect(item.id)"
                >
                    <Check v-if="item.id === currentValue || (Array.isArray(currentValue) && currentValue.includes(item.id))" class=" flex items-center justify-center h-4 w-4 mr-2" />
                    <span v-else class=" flex items-center justify-center h-4 w-4 mr-2" />
                    <span>{{ item.name }}</span>
                </li>
            </SelectGroup>
        </SelectContent>
    </SelectRoot>
</template>
<script setup lang="ts">
import { SelectRoot } from 'radix-vue'
import { Check } from 'lucide-vue-next'
interface Item {
    id: string
    name: string
}
interface Props {
    items: Item[],
    placeholder: string,
    multiple?: boolean,
    modelValue?: Item | string | undefined | string[]
}
const props = withDefaults(defineProps<Props>(), { items: () => [], placeholder: '', multiple: false })
const emit = defineEmits(['update:modelValue', 'update:open'])
const open = ref(false)
const currentValue = ref<undefined | string | Item | string[]>(undefined)
watch(() => props.modelValue, (val) => {

    currentValue.value = val
}, { immediate: true })
const currentLabel = computed(() => {
    if (!currentValue.value) return props.placeholder
    if (typeof currentValue.value === 'string') {
        return props.items.find((item) => item.id === currentValue.value)?.name || props.placeholder
    }
    if (Array.isArray(currentValue.value)) {
        return currentValue.value.map((id) => props.items.find((item) => item.id === id)?.name).join(', ')
    }
    // return currentValue.value.name
})
const handleSelect = (value: string) => {
    if (!props.multiple) {
        if (currentValue.value !== value) {
            currentValue.value = value;
            emit('update:modelValue', value)
        }
        open.value = false 
    } else {
        if (currentValue.value === undefined) {
            currentValue.value = [value]
        } else if(Array.isArray(currentValue.value)) {
            const index = currentValue.value.findIndex((item) => item === value)
            if (index !== -1) {
                currentValue.value.splice(index, 1)
            } else {
                currentValue.value.push(value)
            }
        }
        emit('update:modelValue', currentValue.value)
    }
}
</script>

