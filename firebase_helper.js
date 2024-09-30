function firebase_helper() {

    const firebaseConfig = {
        apiKey: "AIzaSyByTqUovi4bo0_1rQt7rkfm26p3iql5F_A",
        authDomain: "ben-rch.firebaseapp.com",
        projectId: "ben-rch",
        storageBucket: "ben-rch.appspot.com",
        messagingSenderId: "417232361973",
        appId: "1:417232361973:web:e428cb626766d4e44268bc"
    };

    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(app);

    async function getData() {
        const qs = await db.collection("meal").get();
        const data = {};
        qs.forEach((doc) => {
            data[doc.id] = doc.data();
        });
        return data;
    }

    async function getUserData(uid) {
        const qs = await db.collection("users").doc(uid.toString()).get();
        return qs.data();
    }

    function setData(c, d, obj) {
        db.collection(c).doc(d).set(obj);
    }

    return {
        getData,
        getUserData,
        setData
    };
}