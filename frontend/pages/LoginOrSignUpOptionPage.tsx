import {View, Text, StyleSheet, Image} from "react-native";
import LoginForm from "../components/loginSignupPageComponents/LoginForm";
import SignUpButton from "../components/loginSignupPageComponents/buttons/SignUpButton";
import LoginButton from "../components/loginSignupPageComponents/buttons/LogInButton";

const LogInOrSignUpOptionPage = () =>{
    return(
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../assets/logo/Logo.png")} height={61} width={193}/>
            </View>
            <SignUpButton/>
            <LoginButton/>
        </View>
    );
}
export default LogInOrSignUpOptionPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
});