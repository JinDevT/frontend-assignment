import { defineStore } from "pinia";
import { issues } from "@/data/mockData";

export const useIssueStore = defineStore("issue", {
  state: () => ({
    issues: [...issues],
  }),
  getters: {
    filteredIssues: (state) => (status) => {
      const issues = state.issues;

      if (status === "ALL") return issues;
      return issues.filter((issue) => issue.status === status);
    },
  },
});
