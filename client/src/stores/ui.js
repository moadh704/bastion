import { defineStore } from 'pinia';

export const themes = {
  purple: {
    name: 'Purple',
    icon: '🟣',
    primary: '#7c3aed',
    secondary: '#2563eb',
    accent: '#a78bfa',
    mesh1: 'rgba(124, 58, 237, 0.25)',
    mesh2: 'rgba(37, 99, 235, 0.2)',
    mesh3: 'rgba(167, 139, 250, 0.15)',
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    avatarColors: ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#0891b2'],
  },
  cyber: {
    name: 'Cyber',
    icon: '🩵',
    primary: '#0891b2',
    secondary: '#0d9488',
    accent: '#22d3ee',
    mesh1: 'rgba(8, 145, 178, 0.25)',
    mesh2: 'rgba(13, 148, 136, 0.2)',
    mesh3: 'rgba(34, 211, 238, 0.15)',
    gradient: 'linear-gradient(135deg, #0891b2, #0d9488)',
    avatarColors: ['#0891b2','#0d9488','#7c3aed','#d97706','#dc2626','#059669'],
  },
  matrix: {
    name: 'Matrix',
    icon: '🟢',
    primary: '#059669',
    secondary: '#065f46',
    accent: '#34d399',
    mesh1: 'rgba(5, 150, 105, 0.25)',
    mesh2: 'rgba(6, 95, 70, 0.2)',
    mesh3: 'rgba(52, 211, 153, 0.15)',
    gradient: 'linear-gradient(135deg, #059669, #065f46)',
    avatarColors: ['#059669','#0891b2','#7c3aed','#d97706','#dc2626','#065f46'],
  },
  crimson: {
    name: 'Crimson',
    icon: '🔴',
    primary: '#dc2626',
    secondary: '#ea580c',
    accent: '#f87171',
    mesh1: 'rgba(220, 38, 38, 0.25)',
    mesh2: 'rgba(234, 88, 12, 0.2)',
    mesh3: 'rgba(248, 113, 113, 0.15)',
    gradient: 'linear-gradient(135deg, #dc2626, #ea580c)',
    avatarColors: ['#dc2626','#ea580c','#7c3aed','#0891b2','#059669','#d97706'],
  },
};

export const useUiStore = defineStore('ui', {
  state: () => ({
    toast: { show: false, message: '', type: 'success' },
    confirm: { show: false, message: '', resolve: null },
    currentTheme: localStorage.getItem('theme') || 'purple',
  }),

  getters: {
    theme: (state) => themes[state.currentTheme],
  },

  actions: {
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    },

    async showConfirm(message) {
      return new Promise((resolve) => {
        this.confirm = { show: true, message, resolve };
      });
    },

    resolveConfirm(value) {
      if (this.confirm.resolve) this.confirm.resolve(value);
      this.confirm = { show: false, message: '', resolve: null };
    },

    setTheme(themeName) {
      this.currentTheme = themeName;
      localStorage.setItem('theme', themeName);
    },
  },
});