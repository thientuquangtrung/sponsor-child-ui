import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: import.meta.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.REACT_APP_FIREBASE_APPID,
    measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

const storage = getStorage(app);

export { auth, provider, storage };
