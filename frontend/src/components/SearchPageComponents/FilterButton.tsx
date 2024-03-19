import {StyleSheet, Text, TouchableOpacity} from "react-native";
import React from "react";

export function FilterButton({selected, text, onClick}) {
    return (
        <TouchableOpacity style={selected ? styles.selectedFilterButton : styles.unselectedFilterButton} onPress={onClick}>
            <Text style={selected ? styles.selectedFilter : styles.unselectedFilter}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    unselectedFilterButton: {
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        padding: 5,
        textAlign: 'center',
        margin: 5
    },
    selectedFilterButton: {
        borderRadius: 10,
        backgroundColor: 'green',
        borderColor: 'white',
        padding: 5,
        textAlign: 'center',
        margin: 5
    },
    selectedFilter: {
        color: 'white',
        fontWeight: 'bold',
    },
    unselectedFilter: {
        color: 'black',
        fontWeight: 'bold',
    }
});
