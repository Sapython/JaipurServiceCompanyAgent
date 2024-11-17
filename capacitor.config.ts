import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shreeva.jaipurservicecompanyagent',
  appName: 'JaipurServiceCompanyAgent',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    SplashScreen:{
      launchAutoHide:true
    },
    PushNotifications:{
      presentationOptions:["badge","sound","alert"]
    }
  }
};

export default config;
