import { defineStore } from 'pinia';
import api from '../api/axios';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    stats: null,
    logs: [],
  }),

  actions: {
    async fetchUsers() {
      const res = await api.get('/users');
      this.users = res.data;
    },

    async fetchStats() {
      const res = await api.get('/users/stats');
      this.stats = res.data;
    },

    async fetchLogs() {
      const res = await api.get('/users/logs');
      this.logs = res.data;
    },

    async banUser(id) {
      await api.put(`/users/${id}/ban`);
      await this.fetchUsers();
    },

    async unbanUser(id) {
      await api.put(`/users/${id}/unban`);
      await this.fetchUsers();
    },

    async deleteUser(id) {
      await api.delete(`/users/${id}`);
      await this.fetchUsers();
    },

    async updateRole(id, role) {
      await api.put(`/users/${id}/role`, { role });
      await this.fetchUsers();
    },
  },
});