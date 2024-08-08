<template>
    <div class="w-full overflow-auto">
        <div class="w-full flex flex-row py-6 gap-x-4 justify-end">
            <template v-for="(item, i) in searchComponents" :index="i">
                <template v-if="item.search">
                    <template v-if="item.search.type === 'text'">
                        <Input v-model="searchValues[item.key]" type="string" :placeholder="item.search.placeholder" class="w-[200px]" />
                    </template>
                    <template  v-else-if="item.search.type === 'select'">
                        <Select v-model="searchValues[item.key]">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue :placeholder="item.search.placeholder" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="selectItem in item.search.items" :value="selectItem.value">
                                        {{ selectItem.text }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>
                </template>
            </template>
            <Button variant="default">Agregar organización</Button>
        </div>
        <table class="table w-full">
            <thead>
                <tr class="border-b-[1px] border-dotted border-primary font-bold text-sm text-primary">
                    <th class="h-[54px] px-[16px] " v-for="header in props.header" :class="header.align ==='center'? 'text-center' : header.align ==='right'? 'text-right': 'text-left' " :key="header.key">
                        <div v-if="header.sortable" class="flex flex-row items-center">
                            <div>{{ header.label }}</div>
                            <CustomIcons name="Arrowdown" class="w-4 h-4 ml-2 cursor-pointer" @click="onSort(header)" :class="{ 'rotate-180': sortStates[header.key]?.localeCompare('asc') === 0, [sortStates[header.key]? 'text-secondary': 'text-primary']: true   }" />
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


export interface DataItem {
    [key: string]: any
}
interface SearchSelectItem {
    value: string
    text: string
}
export interface SearchItem {
    type: 'text' | 'select' | 'date' | 'number',
    placeholder?: string
    position?: number
    items?: SearchSelectItem[]
}
export interface HeaderItem {
    key: string
    label: string
    sortable?: boolean
    align?: 'center' | 'left' | 'right' | undefined
    search?: SearchItem
}
const props = defineProps<{ data: DataItem[], header: HeaderItem[], class?: string | object }>()
const emit = defineEmits(["onSort","onSearch"])

const searchComponents = computed(() => props.header.filter(item => item.search))
const searchValues = reactive<{ [key: string]: string }>({})
watch(()=> searchValues, (value) => {
    emit('onSearch', value)
}, { deep: true })


const sortStates = reactive<{ [key: string]: string | undefined }>({})
const sortObject = reactive<{ [key: string]: string }[]>([])
const onSort = (item: HeaderItem) => {
    const order = sortStates[item.key]
    sortStates[item.key] = order === undefined ? 'asc' : order === 'asc' ? 'desc' : undefined
    Object.assign(sortStates, { [item.key]: order === undefined ? 'asc' : order === 'asc' ? 'desc' : undefined })
    const index = sortObject.findIndex(sortItem => sortItem.field === item.key)
        if (index !== -1) {
            if(!sortStates[item.key]) {
                sortObject.splice(index, 1)
            } else {
                sortObject[index].order = String(sortStates[item.key])
            }
        } else {
            sortObject.push({ field: item.key, order: String(sortStates[item.key]) })
        }
    emit('onSort', sortObject)
}
</script>

