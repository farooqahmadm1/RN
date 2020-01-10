## 24Jul18 06:16pm
* Bolierplate finalized

## 01Oct18 02:53AM
* Added an animation to home screen.
    + This animation runs only on the initial load since the animation call is in `componentDidMount()` event

## 30Dec18 03:29PM
- Hide branch filter when a non-admin user views checklist screen.

## 07Jan19 03:32AM
- In ChecklistView session, there is an employee object in the state as well as a userId in the checklist object
    + This seems redundant, get rid of one

## 08Jan19 06:42AM
* The package babel-presets-expo has been removed since it hindered the build process
    + Because this plugin kept on using an older version of babel-core
    + No functionality lost after removal

## 12Feb19 10:17PM
* Seems that on Android, non-native animations become 'stuck' or don't properly animate because "Debug JS Remotely" option is enabled
    + Too much overhead therefore the animation gets stuck
    + To fix this, simply shake the device to get ReactNative menu and disable this option

## 13Feb19 04:49AM
* Added an animation when a checklist is completed

## 09Apr19 12:01PM
* Fixed inputs getting overshadowed by keyboard in Sales editting screen
    + https://medium.freecodecamp.org/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580
    + This link has a change in the Android Manifest to fix the problem even more (which was not implemented by me at this time)
    + A change will happen only IF the input selected is going to be overshadowed i.e. selecting the top most input will feel like there is no change but selecting the bottom most input will make it move up
* Finished a sales screen to add sales stats
* Added network request on error fallback logic

## 21Apr19 01:22PM
* Added network fallback logic to HomeScreen and ChecklistList screen
* Added color to discount cards of the home screen

## 25Apr19 05:21PM
* Added proper keyboard behaviour to Login screen.

## 12May19 11:39AM
* Added card stack view to checklist view session.
    + https://github.com/lhandel/react-native-card-stack-swiper
    + Swipe right to tick and left to untick

## 29May19 11:42PM
- **DONE 29May19** Try to squeeze in a card that shows instructions for card stack
* Added a infomational card for card stack of checklist view modal
    - As of now, whether to display this or not is dtermined by app first run or not. However, it should be determined by checklist card stack first viewing or not!
* Added a fancy splash screen and animation

## 04Jun19
- Find a way to obtain theme color from theme itself to style the RefresherArrow colors
    + Tried in HomeScreen
- **DONE** Check why Appbars are rendered weird 
    + Instead of using `<Appbar>`, use `<Appbar.Header>`

## 01Jul19 10:54PM
* Fixed the congratulatory message delay of checklist completion event
* Fully integrated the attendance module
* Fully integrated the leaderboard section

## 02Jul19 08:24PM
* ProfileScreen now has different routes based on logged in user's role
    + If admin user, screen is open on same level as overview screen (tab bar visible)
    + If normal user, screen opens over overview screen (tab bar invisible)

## 04Jul19 10:54AM
* Integrated the profile module
* Upgraded version to v2.0.1

## 11Jul19 09:56PM
* Added a swipeable list element
    + https://github.com/jemise111/react-native-swipe-list-view
- **DONE** Finish implementing DownloadScreen
    + Filter
    + Link opening
    + Item deletion

## 31Jul19 09:01AM
! NOTE: As of now, permissions API inclusion (Utils.js) follows the SDK32 format. However, SDK33 has a different format

## 01Aug19 07:12AM
* Increased version number to v2.1.0
- **DONE 01Aug19** Change the notification color to the teal color (currently still has the old yellow color)

## 02Aug19 12:50PM
* NOTE: Turns out that the akunahq.com outputs int values of table as string. There will be errors due to this
* Upgraded version to v2.1.2

## 06Aug19 09:06PM
* Added a privacy URL using an online generator
    + https://app-privacy-policy-generator.firebaseapp.com/#
* Added links to privacy policy in About dialog and login screen
* Updated version to v2.1.3

## 07Aug19 05:11PM
* Updated version to v2.1.4
    + To make way for Android Bundle Package instead of APKs
* Updated SDK version to v33 from v32 to add support for x64 APK support

## 16Aug19 05:13PM
* Fixed issue where the calendar button was not shown in the ChecklistList screen
* Fixed issue where the ChecklistView's questions were not ticked properly
* Spelling mistake "Monhtly" in ChecklistEdit was fixed
* Updated version to v2.1.5

## 01Sept19 05:00 PM
* Moved the server fetch logic in `componentDidMount` of HomeScreen to wait until the Promise in `populateLists` is executed
    + To ensure that the branch list is available before referring to the list.

## 04Sept19 11:03PM
* Removed the branch selector option from the Appbar in ChecklistList view
* Updated version to v2.1.6
* Changed the placeholder text of the search bar in checklist screen

## 11Sept19 03:18PM
* Updated version to v2.2.0

## 10Oct19 01:22AM
* Fixed bug where having a humanName like "testuser2" (i.e. without any spaces) would crash on the ChecklistList screen
- Check why the branch always defaults to the first entry on the ProfileScreen.