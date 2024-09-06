import { createStore, createLogger } from "vuex";
import auth from "./modules/auth";
import note from "./modules/note";

const debug = import.meta.env.MODE !== "production";

export default createStore({
  modules: {
    auth,
    note,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
