<template>
    <div class="w-full">
        <div class="w-full flex flex-row py-6 gap-x-4 justify-end">
            <template v-for="(item, i) in search" :index="i">
                <template v-if="item">
                    <template v-if="item.type === 'text'">
                        <Input v-model="searchValues[item.key]" type="string" :class="item.elementClass" :placeholder="item.placeholder" class="w-[200px]" />
                    </template>
                    <template  v-else-if="item.type === 'select'">
                        <Select  @update:model-value="event => { searchValues[item.key] = event === ' ' ? undefined : event }" :model-value="searchValues[item.key]" :class="item.elementClass">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue :placeholder="item.placeholder" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="selectItem in item.items" :value="selectItem.value">
                                        {{ selectItem.text }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>
                    <template  v-else-if="item.type === 'date'">
                        <DateInput
                            @update:modelValue="event => { searchValues[item.key] = event === ' ' ? undefined : event }" :model-value="searchValues[item.key]" :class="item.elementClass"
                            label="Fecha de creación"
                            format="DD/MM/YYYY"
                            :value="searchValues[item.key]"
                        />
                    </template>
                </template>
            </template>
            <slot name="action-button">
                <!-- Default button in case no prop is passed -->
            </slot>
        </div>
        <div class="overflow-auto">
            <table class="table w-full">
                <thead>
                    <tr class="border-b-[1px] border-dotted border-primary font-bold text-sm text-primary">
                        <th class="h-[54px]" v-if="props.multipleSelect">
                            <button @click="changeGeneralCheckbox">
                                <CustomIcons :name="checkboxGeneralIcon" class="w-12 h-12" />
                            </button>
                        </th>
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
                    <template v-if="props.multipleSelect">
                        <tr v-for="item in props.data" :key="item.id" class="h-12 border-b-[1px] border-[#E2E8F0]">
                            <td>
                                <button @click="onSelectItem(item[props.multipleSelectKey])">
                                    <CustomIcons :name="getSelectIcon(item[props.multipleSelectKey])" class="w-12 h-12" />
                                </button>
                            </td>
                            <td v-for="headerItem in props.header" :key="headerItem.key" class="px-[16px] min-w-[140px]" :class="headerItem.align ==='center'? 'text-center' : headerItem.align ==='right'? 'text-right': 'text-left' ">
                                <slot :name="headerItem.key" :row="item">
                                    {{ item[headerItem.key] }} 
                                </slot>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="item in props.data" :key="item.id" class="h-12 border-b-[1px] border-[#E2E8F0]">
                            <td v-for="headerItem in props.header" :key="headerItem.key" class="px-[16px] min-w-[140px]" :class="headerItem.align ==='center'? 'text-center' : headerItem.align ==='right'? 'text-right': 'text-left' ">
                                <slot :name="headerItem.key" :row="item">
                                    {{ item[headerItem.key] }} 
                                </slot>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
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
    key: string
    elementClass?: string
}
export interface HeaderItem {
    key: string
    label: string
    sortable?: boolean
    align?: 'center' | 'left' | 'right' | undefined
    search?: SearchItem
    
}
interface Props { 
    data: DataItem[],
    header: HeaderItem[],
    search?: SearchItem[],
    multipleSelect?: boolean,
    multipleSelectKey?: string,
    class?: string | object 
}
const props = withDefaults(defineProps<Props>(),{ multipleSelect: false, multipleSelectKey: 'id' })

const emit = defineEmits(["onSort","onSearch", "onMultipleSelect"])

const searchValues = reactive<{ [key: string]: string | undefined }>({})
watch(()=> searchValues, (value) => {
    emit('onSearch', value)
}, { deep: true })

const useMultipleSelect = () => {
    const selectedIdItems   = ref<string[]>([])
    const generalCheckbox   = ref<'empty' | 'all'>('empty')
    const checkboxGeneralIcon = ref<'Checkbox-Checked' | 'Checkbox' | 'Checkbox-Indeterminate'>('Checkbox')
    const changeGeneralCheckbox = () => {
        selectedIdItems.value = []
        if (generalCheckbox.value === 'empty') {
            // selectedIdItems.value = props.data.map(item => item.rucNumber)
            generalCheckbox.value = 'all'
            checkboxGeneralIcon.value = 'Checkbox-Checked'
        } else {
            generalCheckbox.value = 'empty'
            checkboxGeneralIcon.value = 'Checkbox'
        }
        emit('onMultipleSelect', { type: generalCheckbox.value, ids: selectedIdItems.value })
    }
    const onSelectItem = (id: string) => {
        const index = selectedIdItems.value.indexOf(id)
        if (index === -1) {
            selectedIdItems.value.push(id)
        } else {
            selectedIdItems.value.splice(index, 1)
        }
        checkboxGeneralIcon.value = 'Checkbox-Indeterminate'
        emit('onMultipleSelect', { type: generalCheckbox.value, ids: selectedIdItems.value })
    }
    const getSelectIcon = (id: string) => {
        if(generalCheckbox.value === 'empty') {
            return selectedIdItems.value.includes(id) ? 'Checkbox-Checked' : 'Checkbox' 
        } else {
            return selectedIdItems.value.includes(id) ? 'Checkbox' : 'Checkbox-Checked' 
        }
    }
    return { selectedIdItems, generalCheckbox, checkboxGeneralIcon, changeGeneralCheckbox, onSelectItem, getSelectIcon }
}
const { checkboxGeneralIcon, changeGeneralCheckbox, onSelectItem, getSelectIcon }  = useMultipleSelect()

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

