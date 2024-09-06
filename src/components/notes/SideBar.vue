<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { getFormattedTime } from "@/utils/time";
import { NOTE_BY_DAY_KEY } from "@/constants";

const store = useStore();

defineProps({
  currentNote: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["selectNote"]);

const mapDayKeyToTitle = {
  [NOTE_BY_DAY_KEY.TODAY]: "Today",
  [NOTE_BY_DAY_KEY.YESTERDAY]: "Yesterday",
  [NOTE_BY_DAY_KEY.LAST_7_DAYS]: "Previous 7 Days",
  [NOTE_BY_DAY_KEY.LAST_30_DAYS]: "Previous 30 Days",
};

const noteListByDay = computed(() => store.getters["note/noteListByDay"]);

const selectNote = (note) => {
  emit("selectNote", note);
};
</script>

<template>
  <el-menu :default-active="currentNote?.id">
    <template v-for="(notes, day) in noteListByDay" :key="day">
      <el-menu-item-group
        v-if="notes.length > 0"
        :title="mapDayKeyToTitle[day]"
      >
        <transition-group name="list" tag="div">
          <el-menu-item
            v-for="note in notes"
            :key="note.id"
            :index="note.id"
            @click="selectNote(note)"
            :class="{ 'is-active': currentNote?.id === note.id }"
          >
            <el-text class="title-text" truncated>
              {{ note.title || "Untitled" }}
            </el-text>
            <span class="note-time">
              {{ getFormattedTime(note.time, "short") }}
            </span>
          </el-menu-item>
        </transition-group>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>

<style scoped>
/* TODO: dont know why this css is not working */
.el-menu-item-group__title {
  font-size: 16px;
  color: red !important;
}

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
