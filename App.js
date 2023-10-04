import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {useEffect, useState} from "react";

export default function App() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    photo: "",
    familyName: "",
    givenName: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async () => {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices();
      const {user, idToken} = await GoogleSignin.signIn();
      setUserData(user)
      setIsLoading(false)
      console.log(idToken)
    } catch (error) {
      setIsLoading(false)
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          Alert.alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          Alert.alert('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          Alert.alert('play services not available or outdated');
          break;
        default:
          Alert.alert('Something went wrong', error.toString());
      }
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
      webClientId: "", // your Web Client ID, obtained from Google Console
      iosClientId: "", // your iOS Client ID, obtained from Google Console
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
    })
  }, []);

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserData({
        id: "",
        name: "",
        email: "",
        photo: "",
        familyName: "",
        givenName: ""
      })
    } catch (error) {
      console.error(error);
    }
  }
  return (
      <View style={styles.container}>
        {userData.id === "" ? (
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Standard}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => signIn()}
                disabled={isLoading}
            />
        ) : (
            <>
              <Image style={{width: 60, height: 60}} source={{uri: userData.photo}} />
              <View style={{marginTop: 5, marginBottom: 5}}></View>
              <Text>Google Id: {userData.id}</Text>
              <Text>Name: {userData.name}</Text>
              <Text>Email: {userData.email}</Text>
              <View style={{marginTop: 10, marginBottom: 10}}></View>
              <Button title="Sign Out" onPress={() => handleSignOut()} />
            </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
