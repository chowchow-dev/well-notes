import { nanoid } from "nanoid";
import { NOTE_BY_DAY_KEY } from "@/constants";
import { getNoteByDayKey } from "@/utils/time";

// initial state
const state = () => ({
  noteList: [],
  activeNoteId: null,
});

// getters
const getters = {
  noteList: (state) => state.noteList,
  activeNoteId: (state) => state.activeNoteId,
  activeNote: (state) =>
    state.noteList.find((note) => note.id === state.activeNoteId),
  noteListByDay: (state) => {
    const map = {
      [NOTE_BY_DAY_KEY.TODAY]: [],
      [NOTE_BY_DAY_KEY.YESTERDAY]: [],
      [NOTE_BY_DAY_KEY.LAST_7_DAYS]: [],
      [NOTE_BY_DAY_KEY.LAST_30_DAYS]: [],
    };
    state.noteList.forEach((note) => {
      const noteByDayKey = getNoteByDayKey(note.time);
      map[noteByDayKey].push(note);
    });
    return map;
  },
};

// actions
const actions = {
  addNewNote({ commit }) {
    const newNote = {
      id: nanoid(),
      title: "",
      time: new Date().toISOString(),
      markdown: "",
    };
    commit("addNote", newNote);
    commit("setActiveNoteId", newNote.id);
  },
  updateNote({ commit }, updatedNote) {
    commit("updateNote", updatedNote);
  },
  removeNote({ commit, state, getters }) {
    commit("removeNote", state.activeNoteId);
    commit("setActiveNoteId", getters.noteList[0]?.id || null);
  },
  setActiveNote({ commit }, noteId) {
    commit("setActiveNoteId", noteId);
  },
};

// mutations
const mutations = {
  setNoteList(state, noteList) {
    state.noteList = noteList;
  },
  setActiveNoteId(state, activeNoteId) {
    state.activeNoteId = activeNoteId;
  },
  addNote(state, note) {
    state.noteList.unshift(note);
  },
  updateNote(state, updatedNote) {
    const note = state.noteList.find((n) => n.id === updatedNote.id);
    if (note) {
      Object.assign(note, updatedNote);
      // Remove the note from its current position and add it to the top
      state.noteList.splice(state.noteList.indexOf(note), 1);
      state.noteList.unshift(note);
    }
  },
  removeNote(state, noteId) {
    state.noteList = state.noteList.filter((note) => note.id !== noteId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
