import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alhayat.app',
  appName: 'hayat-app',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['*'],
  },
};

export default config;
