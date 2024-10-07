import React, { useState } from 'react';
import { 
  View,
  ScrollView, 
  StyleSheet, 
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';

// Get the screen height
const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const quote: string = "If you don't get what you want, you SUFFER...";

  return (
    <>
      {/* Removing SafeAreaView to ignore the top safe area */}
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Header 
            quote={quote}
          />
          <View >
            <DatePicker />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

interface HeaderProps {
  quote: string;
}

function Header({ quote }: HeaderProps) {
  return (
    <View style={styles.headerRoundedRectangle}>
      <View style={styles.headerContent}>
        <Text>Mindset</Text>
      </View>
      <View style={styles.quoteContainer}>
        <Text>Quoate Icon</Text>

        <Text>{quote}</Text>
      </View>
    </View>
  );
}

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null); // State to track the selected date with 'number | null' type

  const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates: string[] = ['1', '2', '3', '4', '5', '6', '7']; // Example dates, typed as string array

  const handleDatePress = (index: number) => {
    setSelectedDate(index); // Update selected date when a user taps a day/date
  };

  return (
    <View style={styles.DatePickerContainer}>
      <View style={styles.DatePickerRoundedRectangle}>
        <View style={styles.DatesContainer}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.DayDateWrapper,
                selectedDate === index && styles.SelectedDayDateWrapper, // Apply selected style
              ]}
              onPress={() => handleDatePress(index)}
            >
              <Text
                style={[
                  styles.DayText,
                  selectedDate === index && styles.SelectedDayText,
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.DateText,
                  selectedDate === index && styles.SelectedDateText,
                ]}
              >
                {dates[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
  },
  headerRoundedRectangle: {
    backgroundColor: '#f0f0f0',  // Change this to your desired background color
    borderRadius: 10,  // Adjust this value for the amount of roundness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,  // For Android shadow
    height: screenHeight * 0.25,  // Set height to 20% of the screen height

  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60
  },
  quoteContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  DatePickerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  DatePickerRoundedRectangle: {
    width: '100%',
    height: 100, // Adjust height to fit both days and dates
    backgroundColor: '#ccc',
    borderRadius: 20,
    justifyContent: 'center', // Center the content inside the rectangle
  },
  DatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Evenly distribute the days and dates horizontally
    alignItems: 'center',
    paddingHorizontal: 20, // Add horizontal padding
  },
  DayDateWrapper: {
    alignItems: 'center', // Center day and date vertically
    padding: 10, // Add padding around the text
  },
  SelectedDayDateWrapper: {
    backgroundColor: '#555', // Darker background for selected date
    borderRadius: 10, // Rounded corners for selected date
  },
  DayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  SelectedDayText: {
    color: '#fff', // White text color for selected day
  },
  DateText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5, // Adds a gap between day and date
  },
  SelectedDateText: {
    color: '#fff', // White text color for selected date
  },
});
