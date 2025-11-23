<template>
    <table class="table">
        <thead>
            <tr>
                <th v-if="rowCounter">No.</th>
                <th v-for="(header, index) in headers" :key="'header-' + index" v-html="header"></th>
                <th v-if="actions.length>0">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, rowIndex) in items" :key="'item-' + rowIndex">
                <td v-if="rowCounter" v-html="rowIndex + 1"></td>
                <td v-for="(field, colIndex) in Object.keys(item)" :key="'field' + colIndex + '-' + rowIndex"
                    v-html="item[field]"></td>
                <td v-for="(action, actionIndex) in actions" :key="'action-'+actionIndex+rowIndex">
                    <button v-for="(action, actionIndex) in actions" :key="'action-'+actionIndex+rowIndex" v-html="action.btnTitle" :class="action.btnClass" @click.prevent="$emit(action.emitFn, item)"></button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
const props = defineProps({
    rowCounter: {
        type: Boolean,
        default: false
    },
    headers: {
        type: Array,
        validator: (value) => Array.isArray(value) && value.every(item => typeof item === 'string'),
        required: true
    },
    items: {
        type: Array,
        validator: (value) => Array.isArray(value) && value.every(item => typeof item === 'object'),
        required: true
    },
    actions: {
        type: Array,
        validator: (value) => {
            return Array.isArray(value) && value.every(action =>
                typeof action === 'object' &&
                'btnTitle' in action && typeof action.btnTitle === 'string' &&
                'btnClass' in action && typeof action.btnClass === 'string' &&
                'emitFn' in action && typeof action.emitFn === 'string'
            );
        },
        default: []
    }
});
</script>

<style></style>