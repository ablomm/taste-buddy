import React from 'react';
import { Text, StyleSheet } from "react-native";
import { Tag } from './AddTagForm';
import { TouchableRipple } from 'react-native-paper';

export interface IngredientListItemProps {
    tag: Tag,
    onPress: any,
}


const IngredientListItem = ({ tag, onPress }: IngredientListItemProps) => {
    return (

        <TouchableRipple style={styles.view} onPress={onPress} borderless={true}>
            <Text style={styles.value}>{tag.value}</Text>
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
    value: {
        fontSize: 20,
        margin: 10,
        flexGrow: 1
    },
})

export default IngredientListItem;