<script setup>
import { computed } from "vue";
import { getFormattedTime } from "@/utils/time";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  currentNote: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["selectNote"]);

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => new Date(b.time) - new Date(a.time));
});

const selectNote = (note) => {
  emit("selectNote", note);
};
</script>

<template>
  <el-menu :default-active="currentNote?.id">
    <transition-group name="list" tag="el-menu">
      <el-menu-item
        v-for="note in sortedItems"
        :key="note.id"
        :index="note.id"
        @click="selectNote(note)"
      >
        <el-text class="title-text" truncated>
          {{ note.title || "Untitled" }}
        </el-text>
        <span class="note-time">
          {{ getFormattedTime(note.time, "short") }}
        </span>
      </el-menu-item>
    </transition-group>
  </el-menu>
</template>

<style scoped>
.el-menu {
  flex-grow: 1;
  overflow-y: auto;
  border-right: none;
}

.el-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-menu-item.is-active {
  background-color: #f0f0f0;
}

.title-text {
  margin-right: 8px;
}

.title-input {
  margin-right: 8px;
}

.note-time {
  font-size: 0.8em;
  color: #999;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
