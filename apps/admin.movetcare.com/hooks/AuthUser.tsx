import { auth } from 'services/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
//import { doc, getDoc } from 'firebase/firestore';

export function useUserData() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const fetchUserData = async () => {
        // console.log('user?.uid', user?.uid);
        // const docRef = doc(firestore, 'admins', user?.uid);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   console.log('Document data:', docSnap.data());
        // } else {
        //   console.log('No such document!');
        // }
      };
      fetchUserData();
    } else setUserData(null);

    return unsubscribe;
  }, [user]);

  return { user, userData };
}
