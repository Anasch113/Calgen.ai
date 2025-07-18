import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,




} from "firebase/auth";
import { auth } from "../firebase";
import { getDatabase, ref, get, set, onValue, update } from "firebase/database";
import { database } from "../firebase";
import axios from "axios"
import toast from "react-hot-toast";
import { uploadingFunctions } from "./contextFiles/uploadingFunctions";
import { useAuthHook } from "../GlobalState/customHooks/useAuthHook"

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [message, setMessage] = useState("");

  const { file, setFile, filename, setFileName, cloudUrl, setCloudUrl, progress, setProgress, isUpload, setIsUpload, cloudUrls, setCloudUrls, fileDurations, setFileDurations, cost, setCost, showFormModal, setShowFormModal, showPaymentModal, setShowPaymentModal, uploadingfileNames, setUploadingFileNames, fileNames, setFileNames, chunksLoading, setChunksLOading, handleFileChange, fileDuration, isPaymentInProgress, setIsPaymentInProgress, handleTextFileChange, fileContent, setFileContent, largeFileProgress } = uploadingFunctions()



  async function logIn(email, password) {


    const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/emails/email-verify-login`, { email });
    console.log("response from server verify login", response.data)

    if (response.data.message === "Email not verified. Verification email sent") {
      setMessage(response.data.message)

      return null
    }

    else if (response.data.message === "Email verified") {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user

      const dataBaseRef = ref(database, `users/${user.uid}/mfa`);
      const snapshot = await get(dataBaseRef);
      const mfaData = snapshot.val();

      if (mfaData?.isMfaActive) {

        return { user, requiresMfa: true, method: mfaData.method };
      }


      toast.success("Login successfully")
      setMessage("Verified Email")
      console.log("userCredentials in context", userCredential)


      return { userCredential, requiresMfa: false };


    }

  }


  const signUp = async (email, password, name) => {


    // Create the user without signing in
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send email verification
    const userData = userCredential.user;
    console.log("userData: ", userData);

    if (userData.emailVerified === false) {

      await sendEmailVerification(userData);
      console.log("Verify your email in order to signup")
      setUser(null);
    }
    await createUserInDatabase(userData.uid, { email: userData.email, name: name });


    return userCredential;


  };

  // SignUp with google

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const userCredentials = await signInWithPopup(auth, provider);
      const userData = userCredentials.user;

      const userRef = ref(database, `users/${userData.uid}`);
      const snapshot = await get(userRef); // Use `get` instead of `onValue` for one-time retrieval
      const userDetails = snapshot.val();

      if (userDetails) {
        console.log("User already exists in Realtime Database:", userDetails);

        // Check MFA status


        const mfaData = userDetails.mfa || {};
        console.log("mfa data in console", mfaData)
        if (mfaData.isMfaActive) {
          return { user: userData, requiresMfa: true, method: mfaData.method };
        }

        return { user: userData, requiresMfa: false };

      } else {
        // Create new user in the database
        await createUserInDatabase(userData.uid, {
          email: userData.email,
          name: userData.displayName,

        });
        console.log("User signed up with Google and data stored in database.");
        return { user: userData, requiresMfa: false };
      }
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
      throw error;
    }
  };

  // SignUp with Facebook

  const signUpWithFaceBook = async () => {
    const provider = new FacebookAuthProvider()

    try {
      const userCredentials = await signInWithPopup(auth, provider);
      const userData = userCredentials.user;

      await createUserInDatabase(userData.uid, { email: userData.email, name: userData.displayName });
      console.log("User signed up with facebook and data stored in database.");

    } catch (error) {
      console.error("Error signing up with facebook:", error.message);
    }

  }

  const createUserInDatabase = async (userId, userData) => {
    try {

      const userRef = ref(database, `users/${userId}`);
      await set(userRef, userData);
      console.log("User data created in the Realtime Database");
    } catch (error) {
      console.error("Error creating user data in the Realtime Database:", error.message);
      throw error;
    }
  };

  async function logOut() {

    const userRef = ref(database, `users/${user.uid}/mfa`);
    await update(userRef, {
      loginAccess: false
    });

    return signOut(auth)
  }

  useEffect(() => {
    if (user) {

      const fetchPaymentDetails = async () => {


        try {
          const paymentRef = ref(database, `users/${user.uid}/subscription`);
          const paymentSnapshot = await get(paymentRef);

          if (paymentSnapshot.exists()) {
            const paymentData = paymentSnapshot.val();


            setPaymentInfo(paymentData)


          }
        } catch (error) {
          console.log("error while fetching payment details", error)
        }
      }

      fetchPaymentDetails();

    }
  }, [user])

  useEffect(() => {
    if (user) {

      try {

        const userRef = ref(database, `users/${user.uid}/credit-payment`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();

          console.log(userData)

          if (userData) {
            let balance = parseFloat(userData.balance).toFixed(2); // Ensure 1 decimal place
            setUserBalance(balance);
            console.log("Balance of user:", balance + "$");
          }


          return
        });
      } catch (error) {
        console.log("Error while fething balance of user", error)
      }

    }



  }, [user]);


  const [mfaData, setMfaData] = useState(null);

  // useEffect(() => {
  //   const fetchMfaData = async () => {
  //     if (user) {
  //       const dataBaseRef = ref(database, `users/${user.uid}/mfa`);
  //       const snapshot = await get(dataBaseRef);
  //       const mfaData = snapshot.val()

  //       setMfaData(snapshot.val());

  //     }
  //   };

  //   fetchMfaData();
  // }, [user]);




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      console.log("user in useEffect", currentuser)

    });

    return () => {
      unsubscribe();
    };
  }, []);




  return (
    <userAuthContext.Provider
      value={{ user, signUp, logIn, logOut, paymentInfo, userBalance, signUpWithGoogle, signUpWithFaceBook, message, file, setFile, filename, setFileName, cloudUrl, setCloudUrl, progress, setProgress, isUpload, setIsUpload, cloudUrls, setCloudUrls, fileDurations, setFileDurations, cost, setCost, showFormModal, setShowFormModal, showPaymentModal, setShowPaymentModal, uploadingfileNames, setUploadingFileNames, fileNames, setFileNames, chunksLoading, setChunksLOading, handleFileChange, fileDuration, isPaymentInProgress, setIsPaymentInProgress, handleTextFileChange, fileContent, setFileContent, mfaData, largeFileProgress }}

    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}