import { defineStore } from "pinia";
import { issues } from "@/data/mockData";

export const useIssueStore = defineStore("issue", {
  state: () => ({
    issues: [...issues],
  }),
  getters: {
    filteredIssues: (state) => (status) => {
      if (status === "ALL") return state.issues;
      return state.issues.filter((issue) => issue.status === status);
    },
  },
});
