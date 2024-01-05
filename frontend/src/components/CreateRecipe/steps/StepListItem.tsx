import React from 'react';
import { Text, StyleSheet } from "react-native";
import { TouchableRipple } from 'react-native-paper';

export interface Step {
    step: string,
  }
  

export interface StepListItemProps {
    item: Step,
    index: number,
    onPress: any,
}


const StepListItem = ({ item, index, onPress }: StepListItemProps) => {
    return (

        <TouchableRipple style={styles.view} onPress={onPress} borderless={true}>
            <>
            <Text style={styles.index}>{index + 1}</Text>
            <Text style={styles.step}>{item.step}</Text>
            </>
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "white",
        borderRadius: 10,
        margin: 10,
        marginBottom: 0,
    },
    step: {
        fontSize: 20,
        margin: 10,
        flexGrow: 1
    },
    index: {
        flexBasis: '20%',
        borderRightWidth: 1,
        alignSelf: 'center',
        textAlign: 'center'
    }
})


export default StepListItem;