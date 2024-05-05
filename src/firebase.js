import { initializeApp } from "firebase/app";
import { getFirestore} from  "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA_ogoD98-tzPFELAwzy3jn3ENgjb1C-yk",
  authDomain: "securin-assesment.firebaseapp.com",
  projectId: "securin-assesment",
  storageBucket: "securin-assesment.appspot.com",
  messagingSenderId: "961542005397",
  appId: "1:961542005397:web:d16b4210f9cd345539b19c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

export default db;