import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from 'services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Client } from 'types/Client';

export const useClientData = () => {
  const auth = getAuth();
  const [client, setClient] = useState<null | Client>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setHasError] = useState<null | any>(null);

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, user => {
      if (user) {
        const unsubscribe = onSnapshot(
          doc(firestore, 'clients', user?.uid),
          (doc: any) => {
            setClient(doc.data());
            setHasError(null);
            setIsLoading(false);
          },
          (error: any) => {
            setHasError(error);
            setIsLoading(false);
          }
        );
        return () => unsubscribe();
      } else return;
    });
  }, [auth]);

  return {
    client,
    loading,
    error,
  };
};
