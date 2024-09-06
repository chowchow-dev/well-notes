<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch, onMounted } from "vue";
import { nanoid } from "nanoid";
import { Delete } from "@element-plus/icons-vue";
import Sidebar from "./SideBar.vue";
import NoteDetail from "./NoteDetail.vue";
import UserProfile from "../UserProfile.vue";
import { useLocalStorage } from "../../hooks/localStorage";

const KEY = "notes";

const storage = useLocalStorage(KEY);

const noteList = ref([]);
const currentNote = ref(null);

const assignActiveNote = (note) => {
  currentNote.value = note;
};

const addNewNote = (onAddNoteSuccess) => {
  const newNote = {
    id: nanoid(),
    title: "",
    time: new Date(),
    markdown: "",
  };
  noteList.value.unshift(newNote);
  assignActiveNote(newNote);
  onAddNoteSuccess();
};

const handleSelectNote = (note) => {
  if (noteList.value.length > 1 && currentNote.value.markdown.length === 0) {
    noteList.value = noteList.value.filter(
      (note) => note.id !== currentNote.value.id
    );
  }
  assignActiveNote(note);
};

const removeNote = () => {
  noteList.value = noteList.value.filter(
    (note) => note.id !== currentNote.value?.id
  );
  assignActiveNote(noteList.value[0] || null);
};

const updateNote = (updatedNote) => {
  const note = noteList.value.find((n) => n.id === updatedNote.id);
  if (note) {
    note.markdown = updatedNote.markdown;
    note.time = updatedNote.time;
  }
};

const updateNoteTitle = (updatedNote) => {
  const note = noteList.value.find((n) => n.id === updatedNote.id);
  if (note) {
    note.title = updatedNote.title;
  }
};

watch(
  noteList,
  (newNoteList) => {
    storage.setLocalData(newNoteList);
  },
  { deep: true }
);

onMounted(() => {
  const notes = storage.getLocalData();
  if (notes) {
    noteList.value = notes;
    assignActiveNote(noteList.value[0]);
  }
});
</script>

<template>
  <el-container class="app-container">
    <UserProfile />
    <el-header class="app-header">Well Notes</el-header>
    <el-container class="app-main">
      <el-aside class="app-sidebar">
        <el-button
          @click="removeNote"
          type="danger"
          :icon="Delete"
          circle
          class="remove-button"
        />
        <Sidebar
          :items="noteList"
          :currentNote="currentNote"
          @selectNote="handleSelectNote"
          @updateTitle="updateNoteTitle"
        />
      </el-aside>
      <el-main class="app-main-content">
        <NoteDetail
          :currentNote="currentNote"
          @saveNote="updateNote"
          @addNote="addNewNote"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100%;
}

.app-header {
  font-size: 24px;
  font-weight: bold;
  padding: 0;
  padding-top: 16px;
  margin: auto;
}

.app-sidebar {
  padding-block: 8px;
  padding-inline: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  border-right: 1px solid var(--el-menu-border-color);
}

.app-main {
  padding: 0;
  display: flex;
  gap: 8px;
  max-height: calc(100vh - 100px);
}

.app-main-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.remove-button {
  align-self: flex-end;
}
</style>
