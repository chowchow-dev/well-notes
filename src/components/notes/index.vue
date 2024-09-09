<script setup>
import { parse as markedParse } from "marked";
import DOMPurify from "dompurify";
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { Delete } from "@element-plus/icons-vue";
import { useLocalStorage } from "@/hooks/localStorage";
import NoteDetail from "./NoteDetail.vue";
import UserProfile from "../UserProfile.vue";
import Sidebar from "./SideBar.vue";

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
  store.dispatch("note/addNewNote").then(() => {
    onAddNoteSuccess();
  });
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
  <el-container :class="$style.appContainer">
    <UserProfile />
    <el-header :class="$style.appHeader">Well Notes</el-header>
    <el-container :class="$style.appMain">
      <el-aside :class="$style.appSidebar">
        <el-button
          :class="$style.removeButton"
          type="danger"
          circle
          :icon="Delete"
          @click="handleRemoveNote"
        />
        <Sidebar :currentNote="currentNote" @selectNote="handleSelectNote" />
      </el-aside>
      <el-main :class="$style.appMainContent">
        <NoteDetail
          :currentNote="currentNote"
          @saveNote="handleSaveNote"
          @addNote="handleAddNote"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<style module>
.appContainer {
  height: 100%;
}

.appHeader {
  font-size: 24px;
  font-weight: bold;
  padding: 0;
  padding-top: 16px;
  margin: auto;
}

.appSidebar {
  padding-block: 8px;
  padding-inline: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  border-right: 1px solid var(--el-menu-border-color);
}

.appMain {
  padding: 0;
  display: flex;
  gap: 8px;
  max-height: calc(100vh - 100px);
}

.appMainContent {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.removeButton {
  align-self: flex-end;
}
</style>
