import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the dietary and allergy options
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];
const allergyOptions = ['Shellfish', 'Soy', 'Egg', 'Fish', 'Other'];

// Functional component for the diet selection page
const DietSelectionPage: React.FC = () => {
  // State to track selected dietary and allergy options
  const [selectedDietaryOptions, setSelectedDietaryOptions] = useState<string[]>([]);
  const [selectedAllergyOptions, setSelectedAllergyOptions] = useState<string[]>([]);

  // Function to toggle the selected dietary option
  const toggleDietaryOption = (option: string) => {
    if (selectedDietaryOptions.includes(option)) {
      setSelectedDietaryOptions(selectedDietaryOptions.filter((item) => item !== option));
    } else {
      setSelectedDietaryOptions([...selectedDietaryOptions, option]);
    }
  };

  // Function to toggle the selected allergy option
  const toggleAllergyOption = (option: string) => {
    if (selectedAllergyOptions.includes(option)) {
      setSelectedAllergyOptions(selectedAllergyOptions.filter((item) => item !== option));
    } else {
      setSelectedAllergyOptions([...selectedAllergyOptions, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Dietary and Allergy Options</Text>

      {/* Render the list of dietary options */}
      <Text style={styles.subHeading}>Dietary Preferences:</Text>
      {dietaryOptions.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.option, selectedDietaryOptions.includes(option) && styles.selectedOption]}
          onPress={() => toggleDietaryOption(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Render the list of allergy options */}
      <Text style={styles.subHeading}>Food Allergies:</Text>
      {allergyOptions.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.option, selectedAllergyOptions.includes(option) && styles.selectedOption]}
          onPress={() => toggleAllergyOption(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Display the selected options */}
      <View style={styles.selectedOptionsContainer}>
        <Text style={styles.selectedOptionsText}>Selected Dietary Options:</Text>
        {selectedDietaryOptions.map((option) => (
          <Text key={option} style={styles.selectedOptionText}>
            {option}
          </Text>
        ))}

        <Text style={styles.selectedOptionsText}>Selected Allergy Options:</Text>
        {selectedAllergyOptions.map((option) => (
          <Text key={option} style={styles.selectedOptionText}>
            {option}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionsContainer: {
    marginTop: 16,
  },
  selectedOptionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedOptionText: {
    fontSize: 16,
  },
});

export default DietSelectionPage;