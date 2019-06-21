import firebase from 'firebase';


export const initializeFirebase = () => {

    firebase.initializeApp({
        // messagingSenderId: "365126484633",
        // apiKey: "AIzaSyBZRXJdcBsa3i0QXfFKsvNxWhn_1mKjmmc",
        // authDomain: "eojts-ddc9e.firebaseapp.com",
        // databaseURL: "https://eojts-ddc9e.firebaseio.com",
        // projectId: "eojts-ddc9e",
        // storageBucket: "gs://eojts-ddc9e.appspot.com",
        // messagingSenderId: "365126484633",
        // appId: "1:365126484633:web:623e362d3746d457"

        apiKey: "AIzaSyA9WAFEAL9ZiQQ6Wn0syCQZ1lJSS3fD9GU",
        authDomain: "project-eojts.firebaseapp.com",
        databaseURL: "https://project-eojts.firebaseio.com",
        projectId: "project-eojts",
        storageBucket: "project-eojts.appspot.com",
        messagingSenderId: "882588722429",
        appId: "1:882588722429:web:bc17cfd9b761e33f"
    })
};


export const askForPermissioToReceiveNotifications = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('Token user firebase:', token);

        return token;
    } catch (error) {
        console.error(error);
    }
}