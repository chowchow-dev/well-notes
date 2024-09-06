<script setup>
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { Delete } from "@element-plus/icons-vue";
import Sidebar from "./SideBar.vue";
import NoteDetail from "./NoteDetail.vue";
import UserProfile from "../UserProfile.vue";
import { useLocalStorage } from "../../hooks/localStorage";

const storage = useLocalStorage("notes");
const store = useStore();

const noteList = computed(() => store.getters["note/noteList"]);
const currentNote = computed(() => store.getters["note/activeNote"]);
const noteListByDay = computed(() => store.getters["note/noteListByDay"]);

const handleSelectNote = (note) => {
  if (noteList.value.length > 1 && currentNote.value.markdown.length === 0) {
    store.dispatch("note/removeNote");
  }
  store.dispatch("note/setActiveNote", note.id);
};

const addNewNote = (onAddNoteSuccess) => {
  store.dispatch("note/addNewNote");
  onAddNoteSuccess();
};

const removeNote = () => {
  store.dispatch("note/removeNote");
  store.dispatch(
    "note/setActiveNote",
    noteList.value[0] ? noteList.value[0].id : null
  );
};

const updateNote = (updatedNote) => {
  store.dispatch("note/updateNote", updatedNote);
};

const updateNoteTitle = (updatedNote) => {
  store.dispatch("note/updateNoteTitle", updatedNote);
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
  <pre>{{ noteListByDay }}</pre>

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
