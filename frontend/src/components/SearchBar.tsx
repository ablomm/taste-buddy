import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import TBButton from "./TBButton"

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked }: any) => {
    return (
        <View style={styles.container}>
            <View
                style={
                    clicked
                        ? styles._clicked
                        : styles._unclicked
                }
            >
                {/* search Icon */}
                <Feather
                    name="search"
                    size={16}
                    color="black"
                    style={{ marginLeft: 1 }}
                />
                {/* Input field */}
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={searchPhrase}
                    onChangeText={setSearchPhrase}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />
                {/* cross icon */}
                {clicked && (
                    <Entypo name="cross" size={16} color="black" style={{ padding: 1 }} onPress={() => {
                        setSearchPhrase("")
                    }} />
                )}
            </View>
            {/* cancel button */}
            {clicked && (
                <View>
                    <TBButton
                        title="Cancel"
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                        }}
                    ></TBButton>
                </View>
            )}
        </View>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",

    },
    _unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    _clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 16,
        marginLeft: 10,
        width: "90%",
    },
});

export default SearchBar;
