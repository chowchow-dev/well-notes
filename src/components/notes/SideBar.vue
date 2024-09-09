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
  <el-menu :default-active="currentNote?.id" :class="$style.menu">
    <template v-for="(notes, day) in noteListByDay" :key="day">
      <el-menu-item-group
        v-if="notes.length > 0"
        :title="mapDayKeyToTitle[day]"
        :class="$style.menuItemGroup"
      >
        <transition-group name="list" tag="div" :class="$style.menuItemGroup">
          <el-menu-item
            v-for="note in notes"
            :key="note.id"
            :index="note.id"
            @click="selectNote(note)"
            :class="[
              $style.menuItem,
              { [$style.isActive]: currentNote?.id === note.id },
            ]"
          >
            <el-text :class="$style.titleText" truncated>
              {{ note.title || "Untitled" }}
            </el-text>
            <span :class="$style.noteTime">
              {{ getFormattedTime(note.time, "short") }}
            </span>
          </el-menu-item>
        </transition-group>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>

<style module>
.menuItemGroup :global(.el-menu-item-group__title) {
  font-size: 14px;
  color: gray;
}

.menu {
  flex-grow: 1;
  overflow-y: auto;
  border-right: none;
}

.menuItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.isActive {
  background-color: #f0f0f0;
}

.titleText {
  margin-right: 8px;
}

.noteTime {
  font-size: 0.8em;
  color: #999;
}

:global(.list-move),
:global(.list-enter-active),
:global(.list-leave-active) {
  transition: all 0.5s ease;
}

:global(.list-enter-from),
:global(.list-leave-to) {
  opacity: 0;
  transform: translateX(30px);
}

:global(.list-leave-active) {
  position: absolute;
}
</style>
