import React, {useState} from 'react';
import { View, Text, StyleSheet,} from "react-native";
import Checkbox from 'expo-checkbox';

const CheckboxRecipe = ({checkboxText}:any) => {
    const [isChecked, setChecked] = useState(false);
    return(
        <View style={styles.container}>
            <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                style={styles.checkbox}
                color={"#00D387"}
            />
            <Text style={styles.checkboxText}>{checkboxText}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        margin: 5,
        alignItems: 'center'
    },
    checkbox: {
        margin: 5,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: 15,
        fontWeight: "500"
    }
});
export default CheckboxRecipe;