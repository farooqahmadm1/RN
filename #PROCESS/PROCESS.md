## USER MANUAL
* This project uses the loginApp login template as the login backend

## CREATE PROJECT (DEPRECATED)
* This is assuming yarn is being instead of npm (yarn is recommended)
    + If npm is used, exceute the equivalent npm commands in the same order
* There might be instances where RN vector icons package should be added manually
    + https://callstack.github.io/react-native-paper/getting-started.html
1 `create create-react-native-app my-app`
2 `cd my-app`
3 `yarn add react-navigation`
4 `yarn add react-native-paper`
5 `yarn add react-navigation-material-bottom-tabs`

## CREATE PROJECT - EXPO (CURRENT)
1 `expo init RN3`
2 Select blank project template
3 Select 'Install dependencies using yarn'
4 `cd RN3`
5 `yarn add react-navigation@2.18.3`
6 `yarn add react-native-paper`
7 `yarn add react-navigation-material-bottom-tabs`
8 `yarn add react-native-card-stack-swiper`
9 `yarn add react-native-swipe-list-view`

## MIGRATION TIPS (Expo v30 to v31+) (Copied over from Easyclass project 04Jun19)
* React Native Paper seem to have some updated naming conventions
    + Ex: Toolbar, ToolbarContent...etc have been renamed to Appbar, Appbar.Content naming convention
    + Ex: Card, CardContent have been renamed to Card, Card.Content
    + These will have to be manually renamed. The import statements will also need to modified
* 04Jun19:
    + Dialog, DialogContent...etc have been renamed to Dialog.Content and so on

## DEBUG PROJECT
* Assuming Expo client is already installed on the mobile and it is set up,
1 `set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.106`
2 `yarn start`
3 Scan QR code from Expo
* Sometimes projects using AsyncStorage might seem to freeze on storage access
    + To fix this, simply close Expo and ALL its windows; clear cache on Expo app

## BUILD PROJECT-ANDROID (DEPRECATED)
* Follow instructions on https://docs.expo.io/versions/v33.0.0/distribution/building-standalone-apps/
* Generated a .pem file for App Bundling
    + "C:\Program Files\Java\jre7\bin\keytool.exe" -export -rfc -keystore key.jks -alias upload -file upload_certificate.pem
    + Ran the command from the folder where the old .jks file was stored
* Generating an app-signing key
	+ java -jar pepk.jar --keystore=key.jks --alias=storeboss --output=app_signingkey --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a
* The key that should be used to sign the app is still the .jks key

## BUILD-ANDROID
* Run the command `expo build:android -t app-bundle`
    + The AAB/ APK will be generated in the cloud

## UPDLOADING TO PLAY STORE
1 Make sure you edit version as well as versionCode in app.json (https://docs.expo.io/versions/v33.0.0/workflow/configuration/#versioncode)
2 Make sure the permissions are removed or mentioned