import { nanoid } from "nanoid";

const NOTE_BY_DAY_KEY = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
};

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
      const noteDateString = new Date(note.time).toDateString();

      function getNoteByDayKey(dateString) {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const last7Days = new Date(Date.now() - 7 * 86400000).toDateString();
        if (dateString === today) return NOTE_BY_DAY_KEY.TODAY;
        if (dateString === yesterday) return NOTE_BY_DAY_KEY.YESTERDAY;
        if (dateString >= last7Days) return NOTE_BY_DAY_KEY.LAST_7_DAYS;
        return NOTE_BY_DAY_KEY.LAST_30_DAYS;
      }

      const noteByDayKey = getNoteByDayKey(noteDateString);
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
    console.log("Mutation: ", updatedNote);
    if (note) {
      Object.assign(note, updatedNote);
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
