import {View, Text, StyleSheet, Image} from "react-native";
import LoginForm from "../components/loginPage/LoginForm";

const LoginPage = () =>{
    return(
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../assets/logo/Logo.png")} height={61} width={193}/>
            </View>
            <LoginForm/>
        </View>
    );
}
export default LoginPage;

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