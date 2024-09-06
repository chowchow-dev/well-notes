<script setup>
import { parse as markedParse } from "marked";
import DOMPurify from "dompurify";
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { Delete } from "@element-plus/icons-vue";
import { useLocalStorage } from "@/hooks/localStorage";
import Sidebar from "./SideBar.vue";
import NoteDetail from "./NoteDetail.vue";
import UserProfile from "../UserProfile.vue";

const storage = useLocalStorage("notes");
const store = useStore();

const noteList = computed(() => store.getters["note/noteList"]);
const currentNote = computed(() => store.getters["note/activeNote"]);

const handleSelectNote = (note) => {
  if (noteList.value.length > 1 && currentNote.value.markdown.length === 0) {
    store.dispatch("note/removeNote");
  }
  store.dispatch("note/setActiveNote", note.id);
};

const handleAddNote = (onAddNoteSuccess) => {
  store.dispatch("note/addNewNote");
  onAddNoteSuccess();
};

const handleRemoveNote = () => {
  store.dispatch("note/removeNote");
  store.dispatch(
    "note/setActiveNote",
    noteList.value[0] ? noteList.value[0].id : null
  );
};

const handleSaveNote = (updatedNote) => {
  // Bind note content to title
  const firstLineString = updatedNote.markdown.split("\n")[0];
  const parsed = markedParse(firstLineString);
  const sanitized = DOMPurify.sanitize(parsed);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitized;
  const noteTitle = tempDiv.textContent || tempDiv.innerText;
  updatedNote.title = noteTitle;

  store.dispatch("note/updateNote", updatedNote);
};

watch(
  noteList,
  (newNoteList) => {
    console.log("Sync note list to local storage");
    storage.setLocalData(newNoteList);
  },
  { deep: true }
);

onMounted(() => {
  const notes = storage.getLocalData();
  if (notes) {
    store.commit("note/setNoteList", notes);
    if (notes.length > 0) {
      store.dispatch("note/setActiveNote", notes[0].id);
    }
  }
});
</script>

<template>
  <!-- <pre>{{ noteListByDay }}</pre> -->
  <el-container class="app-container">
    <UserProfile />
    <el-header class="app-header">Well Notes</el-header>
    <el-container class="app-main">
      <el-aside class="app-sidebar">
        <el-button
          class="remove-button"
          type="danger"
          circle
          :icon="Delete"
          @click="handleRemoveNote"
        />
        <Sidebar
          :items="noteList"
          :currentNote="currentNote"
          @selectNote="handleSelectNote"
        />
      </el-aside>
      <el-main class="app-main-content">
        <NoteDetail
          :currentNote="currentNote"
          @saveNote="handleSaveNote"
          @addNote="handleAddNote"
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
