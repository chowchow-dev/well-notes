<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { marked } from "marked";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps({
  currentNote: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["saveNote", "addNote"]);

const input = ref("");
const isEditingContent = ref(false);
const textareaRef = ref(null);

const output = computed(() => {
  return marked(input.value);
});

const focusInput = () => {
  textareaRef.value.focus();
};

const addNote = () => {
  isEditingContent.value = true;
  input.value = "";

  emit("addNote", () => {
    nextTick(() => {
      focusInput();
    });
  });
};

const startEdit = () => {
  isEditingContent.value = true;
  nextTick(() => {
    focusInput();
  });
};

const handleSaveNote = () => {
  if (input.value.trim() === "") {
    return;
  }
  isEditingContent.value = false;
  emit("saveNote", {
    ...props.currentNote,
    markdown: input.value,
    time: new Date(),
  });
};

const handleInputChange = () => {
  emit("saveNote", {
    ...props.currentNote,
    markdown: input.value,
    time: new Date(),
  });
};

watch(
  () => props.currentNote,
  (newVal) => {
    if (newVal && newVal.markdown.length > 0) {
      input.value = newVal.markdown;
      isEditingContent.value = false;
    }
  }
);
</script>
<template>
  <el-button
    type="primary"
    :icon="Plus"
    :disabled="props.currentNote && input.length === 0"
    circle
    class="add-button"
    @click="addNote"
  />
  <div
    v-if="props.currentNote"
    :key="props.currentNote.id"
    class="editor-container"
  >
    <textarea
      v-if="isEditingContent"
      class="editor-input"
      ref="textareaRef"
      v-model="input"
      @input="handleInputChange"
      @blur="handleSaveNote"
    />
    <div v-else class="editor-output" v-html="output" @click="startEdit"></div>
  </div>
</template>

<style scoped>
.editor-container {
  flex-grow: 1;
  display: flex;
  gap: 8px;
}

.editor-input,
.editor-output {
  flex-grow: 1;
  box-sizing: border-box;
  overflow: auto;
}

.editor-input {
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  padding: 16px;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
}

.editor-output :deep(code) {
  color: #f66;
}
</style>
