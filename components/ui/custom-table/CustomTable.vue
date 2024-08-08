<template>
    <div class="w-full overflow-auto">
        <div class="w-full flex flex-row py-6 gap-x-4">
            <Input v-model="searchByName" placeholder="Buscar..." class="ml-auto w-[200px] mb-4" />
            <Input v-model="searchByRuc" placeholder="Buscar RUC..." class="w-[200px] mb-4" />
            <Select v-model="searchByStatus">
                <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">
                        Apple
                        </SelectItem>
                        <SelectItem value="banana">
                        Banana
                        </SelectItem>
                        <SelectItem value="blueberry">
                        Blueberry
                        </SelectItem>
                        <SelectItem value="grapes">
                        Grapes
                        </SelectItem>
                        <SelectItem value="pineapple">
                        Pineapple
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button variant="default">Agregar organización</Button>
        </div>
        <table class="table w-full">
            <thead>
                <tr class="border-b-[1px] border-dotted border-primary font-bold text-sm text-primary">
                    <th class="h-[54px] px-[16px] " v-for="header in props.header" :class="header.align ==='center'? 'text-center' : header.align ==='right'? 'text-right': 'text-left' " :key="header.key">
                        <div v-if="header.sortable" class="flex flex-row items-center">
                            <div>{{ header.label }}</div>
                            <CustomIcons name="Arrowdown" class="w-4 h-4 ml-2" />
                        </div>
                        <template v-else>
                            {{ header.label }}
                        </template>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in props.data" :key="item.id" class="h-12 border-b-[1px] border-[#E2E8F0]">
                    <td v-for="headerItem in props.header" :key="headerItem.key" class="px-[16px] min-w-[140px]">
                        <slot :name="headerItem.key" :row="item">
                            {{ item[headerItem.key] }} 
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </template>
<script setup lang="ts">
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';


interface DataItem {
    [key: string]: any
}
export interface HeaderItem {
    key: string
    label: string
    sortable: boolean
    align?: 'center' | 'left' | 'right' | undefined
}
const props = defineProps<{ data: DataItem[], header: HeaderItem[], class?: string | object }>()
const searchByName = ref('')
const searchByRuc = ref('')
const searchByStatus = ref('')
</script>

