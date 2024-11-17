export const environment = {
  firebase: {
    projectId: 'jaipurservicecompany-demo',
    appId: '1:592897926378:web:40930077d0bc530a42a393',
    storageBucket: 'jaipurservicecompany-demo.appspot.com',
    apiKey: 'REPLACEMENT_STRING',
    authDomain: 'jaipurservicecompany-demo.firebaseapp.com',
    messagingSenderId: '592897926378',
    measurementId: 'G-495GPDZ9HG',
  },
  cloudFunctions: {
    createOrder:
      'https://us-central1-jaipurservicecompany.cloudfunctions.net/createOrder',
    capturePayment:
      'https://us-central1-jaipurservicecompany.cloudfunctions.net/capturePayments',
    createSubscription:
      'https://us-central1-jaipurservicecompany.cloudfunctions.net/createSubscription',
    verifySubscription:
      'https://us-central1-jaipurservicecompany.cloudfunctions.net/verifySubscription',
    checkSubscriptionStatus:
      'https://us-central1-jaipurservicecompany.cloudfunctions.net/checkSubscriptionStatus',
  },
  RAZORPAY_KEY_ID: 'REPLACEMENT_STRING_8cTBlk022y2EDq',
  production: true,
};
