function firebase_helper() {

    const firebaseConfig = {
        apiKey: "AIzaSyDY4EnTKHdZcBEZcHDWZX7F-Zda1su_wOw",
        authDomain: "benwebsite-5ff19.firebaseapp.com",
        projectId: "benwebsite-5ff19",
        storageBucket: "benwebsite-5ff19.appspot.com",
        messagingSenderId: "715958383337",
        appId: "1:715958383337:web:212fb4663e9c1740d9f678"
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
