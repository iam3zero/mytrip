import { createContext, useContext, useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

import { AuthContext } from "./AuthContext";

export const TripContext = createContext();



const TripProvider = ({ children }) => {

  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if (!user) {

      setTrips([]);

      setLoading(false);

      return;

    }



    const tripsRef = collection(

      db,
      "users",
      user.uid,
      "trips"

    );



    // ⭐ 실시간 감지

    const unsubscribe = onSnapshot(

      tripsRef,

      (snapshot) => {

        const data = snapshot.docs.map(doc => ({

          id: doc.id,
          ...doc.data()

        }));


        setTrips(data);

        setLoading(false);

      }

    );



    return unsubscribe;

  }, [user]);




  // CREATE

  const addTrip = async (place) => {

    await addDoc(

      collection(db, "users", user.uid, "trips"),

      place

    );

  };




  // DELETE

  const deleteTrip = async (id) => {

    await deleteDoc(

      doc(db, "users", user.uid, "trips", id)

    );

  };



  return (

    <TripContext.Provider

      value={{

        trips,

        addTrip,

        deleteTrip,

        loading

      }}

    >

      {children}

    </TripContext.Provider>

  );

};



export default TripProvider;