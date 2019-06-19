import firebase from 'firebase';


export const initializeFirebase = () => {
    firebase.initializeApp({
        messagingSenderId: "365126484633",
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