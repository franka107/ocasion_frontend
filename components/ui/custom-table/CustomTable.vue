<template>
  <div class="w-full">
    <div
      class="w-full flex flex-row flex-wrap md:flex-nowrap py-6 gap-4 justify-between"
    >
      <div class="flex flex-wrap justify-start gap-4 flex-grow">
        <template v-for="(item, i) in displayableSearch">
          <template v-if="item">
            <div :key="i" :class="cn('flex flex-col w-[200px]', item.width)">
              <label
                v-if="item.label"
                class="text-sm font-medium text-gray-700 mb-[6px]"
              >
                {{ item.label }}
              </label>
              <template v-if="item.type === 'text'">
                <Input
                  v-model="searchValues[item.key] as string | undefined"
                  type="string"
                  :class="cn('w-[200px]', item.elementClass)"
                  :placeholder="item.placeholder"
                />
              </template>
              <template v-else-if="item.type === 'select'">
                <Select
                  :model-value="searchValues[item.key] as string | undefined"
                  :class="item.elementClass"
                  @update:model-value="
                    (event) => {
                      searchValues[item.key] = event === ' ' ? undefined : event
                    }
                  "
                >
                  <SelectTrigger class="w-[180px]">
                    <SelectValue :placeholder="item.placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="selectItem in item.items"
                        :value="selectItem.value"
                      >
                        {{ selectItem.text }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </template>
              <template v-else-if="item.type === 'date'">
                <DateInput
                  :model-value="searchValues[item.key]"
                  :class="item.elementClass"
                  label="Fecha de creación"
                  format="DD/MM/YYYY"
                  :value="searchValues[item.key] as string | undefined"
                  @update:model-value="
                    (event) => {
                      searchValues[item.key] = event === ' ' ? undefined : event
                    }
                  "
                />
              </template>
              <template v-else-if="item.type === 'date-range'">
                <DateRangeInput
                  :model-value="searchValues[item.key] as string[]"
                  :class="item.elementClass"
                  label="Fecha de creación"
                  placeholder="Inicio - Fin"
                  :value="searchValues[item.key]"
                  @update:model-value="
                    (event) => {
                      searchValues[item.key] = event
                    }
                  "
                />
              </template>
            </div>
          </template>
        </template>
      </div>
      <div>
        <div class="flex">
          <Button
            v-if="props.showMoreButton"
            variant="default"
            class="text-[#F97316] bg-white hover:text-white hover:bg-[#F97316] mr-[8px]"
            @click="displayHiddenFilters = !displayHiddenFilters"
            >Mas filtros</Button
          >
          <slot name="action-button">
            <!-- Default button in case no prop is passed -->
          </slot>
        </div>
      </div>
    </div>
    <div
      class="overflow-auto rounded-lg border border-primary-400"
      :class="[props.class]"
    >
      <table class="table w-full">
        <thead>
          <tr
            :class="[props.class]"
            class="border-b-[1px] border-dashed bg-primary-100 border-primary-400 font-bold text-sm text-primary"
          >
            <th v-if="props.multipleSelect" class="h-[54px]">
              <button @click="changeGeneralCheckbox">
                <CustomIcons :name="checkboxGeneralIcon" class="w-12 h-12" />
              </button>
            </th>
            <th
              v-for="header in props.header"
              :key="header.key"
              class="h-[54px] px-[16px]"
              :class="
                header.align === 'center'
                  ? 'text-center'
                  : header.align === 'right'
                    ? 'text-right'
                    : 'text-left'
              "
            >
              <div v-if="header.sortable" class="flex flex-row items-center">
                <div>{{ header.label }}</div>
                <CustomIcons
                  name="Arrowdown"
                  class="w-4 h-4 ml-2 cursor-pointer"
                  :class="{
                    'rotate-180':
                      sortStates[header.key]?.localeCompare('asc') === 0,
                    [sortStates[header.key]
                      ? 'text-secondary'
                      : 'text-primary']: true,
                  }"
                  @click="onSort(header)"
                />
              </div>
              <template v-else>
                {{ header.label }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="props.data.length > 0">
            <template v-if="props.multipleSelect">
              <tr
                v-for="item in props.data"
                :key="item.id"
                class="h-12 border-b-[1px] border-[#E2E8F0]"
              >
                <td>
                  <button @click="onSelectItem(item[props.multipleSelectKey])">
                    <CustomIcons
                      :name="getSelectIcon(item[props.multipleSelectKey])"
                      class="w-12 h-12"
                    />
                  </button>
                </td>
                <td
                  v-for="headerItem in props.header"
                  :key="headerItem.key"
                  class="px-[16px] min-w-[140px]"
                  :class="
                    headerItem.align === 'center'
                      ? 'text-center'
                      : headerItem.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  "
                >
                  <slot :name="headerItem.key" :row="item">
                    {{ getNestedProperty(item, headerItem.key) }}
                  </slot>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="item in props.data"
                :key="item.id"
                class="h-12 border-b-[1px] border-[#E2E8F0]"
              >
                <td
                  v-for="headerItem in props.header"
                  :key="headerItem.key"
                  class="px-[16px] min-w-[140px]"
                  :class="
                    headerItem.align === 'center'
                      ? 'text-center'
                      : headerItem.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  "
                >
                  <slot :name="headerItem.key" :row="item">
                    {{ getNestedProperty(item, headerItem.key) }}
                  </slot>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="header.length" class="h-24 text-center">
                <EmptyScreen />
              </TableCell>
            </TableRow>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { cva } from 'class-variance-authority'
import consola from 'consola'
import TableCell from '../table/TableCell.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import EmptyScreen from '~/design-system/berlin/screens/empty-screen/EmptyScreen.vue'

export interface DataItem {
  [key: string]: any
}
export type SearchValues = { [key: string]: string | string[] | undefined }
export interface SearchSelectItem {
  value: string
  text: string
}
export interface SearchItem {
  type: 'text' | 'select' | 'date' | 'number' | 'date-range'
  placeholder?: string
  position?: number
  items?: SearchSelectItem[]
  width?: string
  key: string
  isHidden?: boolean
  elementClass?: string
  label?: string
}
export interface HeaderItem {
  key: string
  label: string
  sortable?: boolean
  align?: 'center' | 'left' | 'right' | undefined
  search?: SearchItem
  realKey?: string
}
interface Props {
  data: DataItem[]
  header: HeaderItem[]
  search?: SearchItem[]
  multipleSelect?: boolean
  multipleSelectKey?: string
  showMoreButton?: boolean
  class?: string | object
  bgClass?: string
  searchValues?: SearchValues
}

const props = withDefaults(defineProps<Props>(), {
  multipleSelect: false,
  showMoreButton: false,
  multipleSelectKey: 'id',
  class: '',
  searchValues: {},
})
const { search } = toRefs(props)

const displayHiddenFilters = ref(false)
const displayableSearch = computed(() =>
  displayHiddenFilters.value
    ? search.value
    : search.value?.filter((item) => !item.isHidden) || [],
)

const emit = defineEmits(['onSort', 'onSearch', 'onMultipleSelect'])

const getNestedProperty = (obj: any, key: string) => {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const searchValues = reactive<SearchValues>(props.searchValues)

watch(
  () => searchValues,
  (value) => {
    emit('onSearch', value)
  },
  { deep: true, immediate: true },
)

const useMultipleSelect = () => {
  const selectedIdItems = ref<string[]>([])
  const generalCheckbox = ref<'empty' | 'all'>('empty')
  const checkboxGeneralIcon = ref<
    'Checkbox-Checked' | 'Checkbox' | 'Checkbox-Indeterminate'
  >('Checkbox')

  const resetMultipleSelect = () => {
    generalCheckbox.value = 'empty'
    selectedIdItems.value = []
    checkboxGeneralIcon.value = 'Checkbox'
  }

  const changeGeneralCheckbox = () => {
    selectedIdItems.value = []
    if (generalCheckbox.value === 'empty') {
      // selectedIdItems.value = props.data.map(item => item.id)
      generalCheckbox.value = 'all'
      checkboxGeneralIcon.value = 'Checkbox-Checked'
    } else {
      generalCheckbox.value = 'empty'
      checkboxGeneralIcon.value = 'Checkbox'
    }
    emit('onMultipleSelect', {
      type: generalCheckbox.value,
      ids: selectedIdItems.value,
      resetMultipleSelect,
    })
  }

  const onSelectItem = (id: string) => {
    const index = selectedIdItems.value.indexOf(id)
    if (index === -1) {
      selectedIdItems.value.push(id)
    } else {
      selectedIdItems.value.splice(index, 1)
    }
    checkboxGeneralIcon.value = 'Checkbox-Indeterminate'
    emit('onMultipleSelect', {
      type: generalCheckbox.value,
      ids: selectedIdItems.value,
      resetMultipleSelect,
    })
  }
  const getSelectIcon = (id: string) => {
    if (generalCheckbox.value === 'empty') {
      return selectedIdItems.value.includes(id)
        ? 'Checkbox-Checked'
        : 'Checkbox'
    } else {
      return selectedIdItems.value.includes(id)
        ? 'Checkbox'
        : 'Checkbox-Checked'
    }
  }
  return {
    selectedIdItems,
    generalCheckbox,
    checkboxGeneralIcon,
    changeGeneralCheckbox,
    onSelectItem,
    getSelectIcon,
  }
}
const {
  checkboxGeneralIcon,
  changeGeneralCheckbox,
  onSelectItem,
  getSelectIcon,
} = useMultipleSelect()

const sortStates = reactive<{ [key: string]: string | undefined }>({})
const sortObject = reactive<{ [key: string]: string }[]>([])
const onSort = (item: HeaderItem) => {
  const baseKey = item.realKey || item.key
  consola.info('onSort', baseKey)
  const order = sortStates[baseKey]
  sortStates[baseKey] =
    order === undefined ? 'asc' : order === 'asc' ? 'desc' : undefined
  Object.assign(sortStates, {
    [baseKey]:
      order === undefined ? 'asc' : order === 'asc' ? 'desc' : undefined,
  })
  const index = sortObject.findIndex((sortItem) => sortItem.field === baseKey)
  if (index !== -1) {
    if (!sortStates[baseKey]) {
      sortObject.splice(index, 1)
    } else {
      sortObject[index].order = String(sortStates[baseKey])
    }
  } else {
    sortObject.push({ field: baseKey, order: String(sortStates[baseKey]) })
  }
  emit('onSort', sortObject)
}
</script>
