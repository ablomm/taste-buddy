import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { FilterButton } from "./FilterButton";
import { ModalButton } from "./SortButton";
import {truncateText} from "../../functions/Utility";

export function FilterBar({ tags, onSelectFilter, onSelectOption, onChange }) {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortByModelVisible, setSortByModelVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Relevancy");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    onChange();
  }, [selectedTags, selectedOption]);

  const handleSortOptionPress = (option: string) => {
    setSelectedOption(option);
    setSortByModelVisible(false);
    onSelectOption(option);
  };

  function handleSelectedFilter(option: string) {
    if (selectedTags.includes(option)) {
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.filter((tag) => tag !== option)
      );
      onSelectFilter(selectedTags.filter((tag) => tag !== option));
    } else {
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, option]);
      onSelectFilter([...selectedTags, option]);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setSortByModelVisible(true)}
      >
        <Text style={{ color: "green", fontWeight: "bold" }}>
          Sort By: {selectedOption}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortByModelVisible}
        onRequestClose={() => setSortByModelVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortByModelVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <ModalButton
                onClick={() => handleSortOptionPress("Relevancy")}
                text="Relevancy"
              />
              <ModalButton
                onClick={() => handleSortOptionPress("Calories")}
                text="Calories (Low to High)"
              />
              <ModalButton
                onClick={() => handleSortOptionPress("Cook Time")}
                text="Cook Time (Low to High)"
              />
              <ModalButton
                onClick={() => handleSortOptionPress("Servings")}
                text="Servings (Low to High)"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Icon name="filter" size={20} color="black" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {tags.length == 0 ?
                  <Text>No tags to filter</Text>
                  :
                  <><Text style={styles.modalTitle}>Filter By</Text><FlatList
                      style={styles.list && {maxHeight: 400}}
                      data={tags}
                      renderItem={({item}) => (
                          <FilterButton
                              selected={selectedTags.includes(item)}
                              text={truncateText(item, 14)}
                              onClick={() => handleSelectedFilter(item)}/>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}/><ModalButton
                      text="Done"
                      onClick={() => setFilterModalVisible(false)}/></>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    margin: 10,
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  sortButton: {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  list: {
    width: "100%",
  },
});
