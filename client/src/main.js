import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import router from './router';
import { createPinia } from 'pinia';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#7c3aed',
          secondary: '#2563eb',
          accent: '#a78bfa',
          background: '#0d0d1a',
          surface: '#13131f',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
      },
    },
  },
});

createApp(App)
  .use(vuetify)
  .use(router)
  .use(createPinia())
  .mount('#app');