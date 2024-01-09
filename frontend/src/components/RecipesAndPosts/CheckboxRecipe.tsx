import React from 'react';
import { View, StyleSheet,} from "react-native";
import Checkbox from 'expo-checkbox';

const CheckboxRecipe = () => {
    return(
        <View style={styles.container}>
            <Checkbox
                value={false}
                onValueChange={setSelection}
                style={styles.checkbox}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent: 'space-between',
        margin: 5,
        alignItems: 'center'
    },
});
export default CheckboxRecipe;