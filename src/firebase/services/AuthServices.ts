import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { firebaseAuth } from '../BaseConfig';
import { LoginFormValues, UserFormValues } from '../../interfaces/interfaces';
import Providers from '../providers/Providers';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../BaseConfig'; // Firestore instance

setPersistence(firebaseAuth, browserLocalPersistence);

const SignIn = async ({ email, password }: LoginFormValues) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const isAdmin = await checkAdminRole(result.user.uid);
    return { result, isAdmin };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;  // Handle the error in your UI (e.g., show an alert)
  }
};


const SignUp = async ({ email, password }: UserFormValues) => {
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return result;
};

const SignOut = async () => {
  await signOut(firebaseAuth);
};

const SignInWithGoogle = async () => {
  const result = await signInWithPopup(firebaseAuth, Providers.googleProvider);
  
  // Check if the user is an admin in Firestore
  const isAdmin = await checkAdminRole(result.user.uid);

  return { result, isAdmin };
};

const UpdateProfile = async (
  currentUser: User,
  displayName: string | null,
  photoURL: string | null
) => {
  const result = await updateProfile(currentUser, { displayName, photoURL });
  return result;
};

// Function to check if the user is an admin in Firestore
const checkAdminRole = async (uid: string): Promise<boolean> => {
  try {
    const adminDocRef = doc(db, 'admins', uid); // Reference to the admin document by UID
    const adminDoc = await getDoc(adminDocRef);

    return adminDoc.exists(); // Return true if the document exists
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

const TAuth = {
  SignIn,
  SignUp,
  SignOut,
  UpdateProfile,
  SignInWithGoogle,
};

export default TAuth;
