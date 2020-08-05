import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
	apiKey: "AIzaSyAF4jVCxeIdUEp20WJwFPwPqlarUswm1dY",
	authDomain: "react-slack-66888.firebaseapp.com",
	databaseURL: "https://react-slack-66888.firebaseio.com",
	projectId: "react-slack-66888",
	storageBucket: "react-slack-66888.appspot.com",
	messagingSenderId: "431544186965",
	appId: "1:431544186965:web:f1ae9b198d8513e9753cdc",
	measurementId: "G-FJWB16C6H2",
};
firebase.initializeApp(firebaseConfig);

export default firebase;
