<template>
  <div class="modal fade" :class="{ 'show': isOpen }" :style="{ display: isOpen ? 'block' : 'none' }" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          
          <!-- Confirm Mode -->
          <div v-if="mode === 'confirm'">
            <p>{{ config.message }}</p>
          </div>
          
          <!-- View Mode -->
          <div v-if="mode === 'view'">
            <dl class="row">
              <template v-for="item in config.data" :key="item.label">
                <dt class="col-sm-3">{{ item.label }}</dt>
                <dd class="col-sm-9">{{ item.value }}</dd>
              </template>
            </dl>
          </div>
          
          <!-- Form Mode -->
          <div v-if="mode === 'form'">
            <form @submit.prevent="$emit('submit', formData)">
              <div v-for="field in config.fields" :key="field.name" class="mb-3">
                <label :for="field.name" class="form-label">{{ field.label }}</label>
                <input
                  v-if="field.type === 'text' || field.type === 'password'"
                  :type="field.type"
                  :id="field.name"
                  class="form-control"
                  v-model="formData[field.name]"
                  :required="field.required"
                />
                <textarea
                  v-else-if="field.type === 'textarea'"
                  :id="field.name"
                  class="form-control"
                  v-model="formData[field.name]"
                  :required="field.required"
                  rows="3"
                ></textarea>
                <select
                  v-else-if="field.type === 'select'"
                  :id="field.name"
                  class="form-select"
                  v-model="formData[field.name]"
                  :required="field.required"
                >
                  <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer" v-if="mode === 'confirm' || mode === 'form'">
          <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="isLoading">Đóng</button>
          <button
            v-if="mode === 'confirm'"
            type="button"
            class="btn"
            :class="config.confirmButtonClass || 'btn-primary'"
            @click="$emit('submit')"
            :disabled="isLoading"
          >
            {{ config.confirmButtonText || 'Xác nhận' }}
          </button>
          <button
            v-if="mode === 'form'"
            type="submit"
            class="btn btn-primary"
            @click="$emit('submit', formData)"
            :disabled="isLoading"
          >
            {{ config.confirmButtonText || 'Lưu' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade" :class="{ 'show': isOpen }" v-if="isOpen"></div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

defineProps<{
  isOpen: boolean,
  mode: string,
  title: string,
  config: any,
  isLoading: boolean,
  error: string | null
}>()

defineEmits(['close', 'submit'])

const formData = reactive({})
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}

</style>