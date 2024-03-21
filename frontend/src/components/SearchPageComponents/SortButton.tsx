import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export function ModalButton({ text, onClick }) {
  return (
    <TouchableOpacity style={styles.filterButton} onPress={onClick}>
      <Text style={styles.filterButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    borderRadius: 10,
    backgroundColor: "#8CC84B",
    padding: 10,
    margin: 5,
    minWidth: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
