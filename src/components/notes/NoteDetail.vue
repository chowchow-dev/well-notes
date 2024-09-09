<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { parse as markedParse } from "marked";
import { Plus } from "@element-plus/icons-vue";
import { debounce } from "lodash-es";
import DOMPurify from "dompurify";

const props = defineProps({
  currentNote: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["saveNote", "addNote"]);

const input = ref("");
const textareaRef = ref(null);
const isEditingContent = ref(false);
const isInputDirty = ref(false);

const output = computed(() => {
  const parsed = markedParse(input.value);
  return DOMPurify.sanitize(parsed);
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
  isInputDirty.value = false;
  emit("saveNote", {
    ...props.currentNote,
    markdown: input.value,
    time: new Date().toISOString(),
  });
};

const debouncedSaveNote = debounce((note) => {
  emit("saveNote", note);
}, 300);

const handleInputChange = () => {
  if (!isInputDirty.value) {
    isInputDirty.value = true;
    debouncedSaveNote({
      ...props.currentNote,
      markdown: input.value,
      time: new Date().toISOString(),
    });
  } else {
    debouncedSaveNote({
      ...props.currentNote,
      markdown: input.value,
    });
  }
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
    :class="$style.addButton"
    @click="addNote"
  />
  <div
    v-if="props.currentNote"
    :key="props.currentNote.id"
    :class="$style.editorContainer"
  >
    <textarea
      v-if="isEditingContent"
      :class="$style.editorInput"
      ref="textareaRef"
      v-model="input"
      @input="handleInputChange"
      @blur="handleSaveNote"
    />
    <div
      v-else
      :class="$style.editorOutput"
      v-html="output"
      @click="startEdit"
    ></div>
  </div>
</template>

<style module>
.editorContainer {
  flex-grow: 1;
  display: flex;
  gap: 8px;
}

.editorInput,
.editorOutput {
  flex-grow: 1;
  box-sizing: border-box;
  overflow: auto;
}

.editorInput {
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  padding: 16px;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
}

.editorOutput :global(code) {
  color: #f66;
}
</style>
