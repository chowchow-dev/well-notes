<script setup>
import { ref, watch, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Delete } from "@element-plus/icons-vue";
import Sidebar from "./components/SideBar.vue";
import NoteDetail from "./components/NoteDetail.vue";
import { useLocalStorage } from "./hooks/localStorage";

const KEY = "notes";

const storage = useLocalStorage(KEY);

const noteList = ref([]);
const currentNote = ref(null);

const assingNewActive = (note) => {
  currentNote.value = note;
};

const addNewNote = (onAddNoteSuccess) => {
  const newNote = {
    id: uuidv4(),
    title: "New note",
    time: new Date(),
    markdown: "",
  };
  noteList.value.unshift(newNote);
  assingNewActive(newNote);
  onAddNoteSuccess();
};

const handleSelectNote = (note) => {
  if (noteList.value.length > 1 && currentNote.value.markdown.length === 0) {
    noteList.value = noteList.value.filter(
      (note) => note.id !== currentNote.value.id
    );
  }
  assingNewActive(note);
};

const removeNote = () => {
  noteList.value = noteList.value.filter(
    (note) => note.id !== currentNote.value?.id
  );
  assingNewActive(noteList.value[0] || null);
};

const updateNote = (updatedNote) => {
  console.log("UPDATING NOTE", updatedNote);
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
    assingNewActive(noteList.value[0]);
  }
});
</script>

<template>
  <el-container class="app-container">
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
  margin-top: 8px;
}

.app-sidebar {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
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
  margin-right: 20px;
}
</style>
