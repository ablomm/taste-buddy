import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../providers/UserProvider";
import BackButton from "../components/BackButton";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
];
const allergyOptions = ["Shellfish", "Soy", "Egg", "Fish", "Other"];

const DietSelectionPage: React.FC = () => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

  const navigation = useNavigation();
  const [selectedDietaryOptions, setSelectedDietaryOptions] = useState<
    string[]
  >([]);
  const [selectedAllergyOptions, setSelectedAllergyOptions] = useState<
    string[]
  >([]);

  const toggleDietaryOption = (option: string) => {
    setSelectedDietaryOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  const toggleAllergyOption = (option: string) => {
    setSelectedAllergyOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  const handleContinue = async () => {
    navigation.navigate("AccountPage");
    let selectedOptions = selectedAllergyOptions.concat(selectedDietaryOptions);
    let selectedOptionsString = selectedOptions.join(",");
    try {
      let response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/add-dietary-preference/${username}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            dietaryPref: selectedOptionsString,
          }),
        }
      );

      if (response.status !== 200) {
        console.error("dietaryPref unsuccessful");
      } else {
        console.log("dietaryPref successful");
      }
    } catch (error: any) {
      console.error(error.stack);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton navigation={navigation} />

      <Text style={styles.subHeading}>Dietary Preferences:</Text>
      <View style={styles.optionsContainer}>
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedDietaryOptions.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleDietaryOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeading}>Food Allergies:</Text>
      <View style={styles.optionsContainer}>
        {allergyOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedAllergyOptions.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleAllergyOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selectedOptionsContainer}>
        <Text style={styles.selectedOptionsText}>
          Selected Dietary Options:
        </Text>
        {selectedDietaryOptions.map((option) => (
          <Text key={option} style={styles.selectedOptionText}>
            {option}
          </Text>
        ))}

        <Text style={styles.selectedOptionsText}>
          Selected Allergy Options:
        </Text>
        {selectedAllergyOptions.map((option) => (
          <Text key={option} style={styles.selectedOptionText}>
            {option}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  continueButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "#8CC84B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  option: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "rgba(192, 216, 79, 0.6)",
    borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 14,
  },
  selectedOptionsContainer: {
    marginTop: 16,
  },
  selectedOptionsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectedOptionText: {
    fontSize: 16,
  },
});

export default DietSelectionPage;
