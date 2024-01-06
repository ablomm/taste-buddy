import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Ingredient } from './AddIngredientForm';
import { TouchableRipple } from 'react-native-paper';

export interface IngredientListItemProps {
    ingredient: Ingredient,
    onPress: any,
}


const IngredientListItem = ({ ingredient, onPress }: IngredientListItemProps) => {
    return (

        <TouchableRipple style={styles.view} onPress={onPress} borderless={true}>
            <>
                <Text style={styles.title}>{ingredient.title}</Text>
                <Text style={styles.amount}>{ingredient.amount} {ingredient.unit}</Text>
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
    title: {
        fontSize: 20,
        margin: 10,
        flexGrow: 1
    },
    amount: {
        flexBasis: '20%',
        borderLeftWidth: 1,
        alignSelf: 'center',
        textAlign: 'center'
    }
})

export default IngredientListItem;