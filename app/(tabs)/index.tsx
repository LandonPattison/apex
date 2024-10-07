import React, { useState, useRef, useEffect } from 'react';
import { 
  View,
  ScrollView, 
  StyleSheet, 
  Dimensions,
  Text,
  TouchableOpacity,
  Animated, 
  PanResponder,
  Image,
  Modal,
  Button
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

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
          <Task />
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
        <Text
        style={styles.mindsetText}
        >MINDSET</Text>
      </View>
      <View style={styles.quoteContainer}>
        <Text
        style={styles.quatationText}
        >“</Text>
        <Text
        style={styles.quoteText}
        >{quote}</Text>
      </View>
    </View>
  );
}

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay()); // Automatically set current day to today's day of the week
  const days: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Get the latest Sunday (start of the week)
  const getLatestSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
    const diff = dayOfWeek; // How many days since the last Sunday
    const latestSunday = new Date(today);
    latestSunday.setDate(today.getDate() - diff); // Adjust the date to the latest Sunday
    return latestSunday;
  };

  // Generate dates for the week starting from the latest Sunday
  const generateWeekDates = () => {
    const latestSunday = getLatestSunday();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(latestSunday);
      day.setDate(latestSunday.getDate() + i); // Get the date for each day of the week
      weekDates.push(day); // Store the entire date object
    }
    return weekDates;
  };

  const dates: Date[] = generateWeekDates();
  const today = new Date();

  // Set the current day as selected by default
  useEffect(() => {
    setSelectedDate(currentDay);
  }, [currentDay]);

  const handleDatePress = (index: number) => {
    setSelectedDate(index); // Update selected date when a user taps a day/date
  };

  // Check if a day is in the future
  const isFutureDate = (date: Date) => {
    return date > today; // Compare if the date is after today
  };

  return (
    <View style={styles.DatePickerContainer}>
      <Text style={styles.currentDayText}>
        Day {selectedDate !== null ? selectedDate + 1 : days[currentDay]}
      </Text>
      <View style={styles.DatePickerRoundedRectangle}>
        <View style={styles.DatesContainer}>
          {days.map((day, index) => {
            const date = dates[index];
            const isFuture = isFutureDate(date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.DayDateWrapper,
                  selectedDate === index && !isFuture && styles.SelectedDayDateWrapper, // Apply selected style only if it's not a future date
                ]}
                onPress={() => !isFuture && handleDatePress(index)} // Disable press for future dates
                disabled={isFuture} // Disable TouchableOpacity if it's a future date
              >
                <Text
                  style={[
                    styles.DayText,
                    selectedDate === index && !isFuture && styles.SelectedDayText,
                    isFuture && styles.NonSelectableDate, // Apply non-selectable style for future dates
                  ]}
                >
                  {day}
                </Text>
                <Text
                  style={[
                    styles.DateText,
                    selectedDate === index && !isFuture && styles.SelectedDateText,
                    isFuture && styles.NonSelectableDate, // Apply non-selectable style for future dates
                  ]}
                >
                  {date.getDate().toString()} {/* Display the day of the month */}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};



const Task = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState("Unleash Yourself")
  const [subTitle, setSubTitle] = useState("Unleash Yourself")
  const [modalVisible, setModalVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < 0) {
          // Clamp the movement to -100px maximum
          const limitedDx = Math.max(gestureState.dx, -100);
          Animated.event([null, { dx: pan.x }], {
            useNativeDriver: false,
          })(e, { ...gestureState, dx: limitedDx });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx <= -100) {
          // Mark as completed if slid all the way
          setIsCompleted(true);
        }

        // Snap back to the original position when released
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handlePlayPress = () => {
    console.log('Play button pressed!');
    // Add your play action here
    setModalVisible(true)
  };

  return (
    <View style={styles.TaskContainer}>
      <View style={styles.TaskRoundedRectangles}>
        <View style={styles.horizontalRoundedRectangle}>
          <View style={styles.rectTall} />
          <View style={styles.rectShort} />
        </View>
        <View style={styles.rectShortUnderneath} />
        <View style={styles.rectShortUnderneath} />
        <View style={styles.rectShortUnderneath} />
        <View style={styles.rectShortUnderneath} />
        <View style={styles.rectShortUnderneath} />
      </View>

      {isCompleted ? (
        <View style={[styles.taskParentContainer]}>
          {/* This is the green rounded rectangle */}
          <View style={styles.greenRoundedRectangle} />
        </View>
      ) : (
          <View style={styles.taskParentContainer}>
            <View style={styles.greenRoundedRectangle} />
            <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getLayout(), styles.taskRoundedRectangle]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/images/unleashYourself.webp")}
                  style={styles.image}
                  resizeMode="cover" // Make sure the image covers the container but maintains its aspect ratio
                />
              </View>
              <View style={styles.titleAndSubtitle}>
                <Text> {title} </Text>
                <Text> {subTitle} </Text>
              </View>
              <View style={styles.playButtonContainer}>
                <TouchableOpacity onPress={handlePlayPress}>
                  <Ionicons name="play" size={32} color="black" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
      )}
      <FullScreenModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </View>
  );
};

interface FullScreenModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ modalVisible, setModalVisible }) => {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [position, setPosition] = useState(0);  // Current audio position
  const [duration, setDuration] = useState(0);  // Audio duration

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound');
          sound.unloadAsync(); // Clean up the sound when the component unmounts
        }
      : undefined;
  }, [sound]);

  const updatePosition = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        updatePosition();
      }
    }, 1000); // Update position every second

    return () => clearInterval(interval);
  }, [playing, sound]);

  async function playSound() {
    if (sound) {
      await sound.playAsync();
    } else {
      console.log('Loading Sound');
      const { sound: newSound } = await Audio.Sound.createAsync(require('../../assets/focus.mp3'));
      setSound(newSound);
      await newSound.playAsync();
    }
  }

  const handlePlayPress = async () => {
    console.log('Play button pressed!');
    await playSound();
    setPlaying(true);
  };

  const handlePausePress = async () => {
    if (sound) {
      await sound.pauseAsync();
      setPlaying(false);
    }
  };

  const handle10SecondsBack = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, status.positionMillis - 10000); // Go back 10 seconds, but not less than 0
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
      }
    }
  };

  const handle10SecondsForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000); // Skip forward 10 seconds
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
      }
    }
  };

  const handleSliderChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        {/* Top Left Chevron */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="chevron-back-outline" size={32} color="black" />
        </TouchableOpacity>
  
        {/* Centered Image */}
        <Image
          source={require("../../assets/images/unleashYourself.webp")}
          style={styles.modalImage}
          resizeMode="cover" // Maintain aspect ratio while covering the container
        />
  
        {/* Text below image */}
        <Text style={styles.modalText}>How to improve your focus</Text>
        <Text style={styles.subText}>Improve by APEX</Text>
  
        {/* Time display */}
        <View style={styles.timeDisplay}>
          <Text>{formatTime(position)}</Text>
          <Text>{formatTime(duration)}</Text>
        </View>

        {/* Slider above controls */}
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={handleSliderChange}
          style={styles.slider}
        />
  
        {/* Control buttons (left, play/pause, right) in one row */}
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={handle10SecondsBack}>
            <Ionicons name="play-back-outline" size={32} color="black" />
          </TouchableOpacity>
  
          {playing ? (
            <TouchableOpacity onPress={handlePausePress}>
              <Ionicons name="pause" size={32} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlayPress}>
              <Ionicons name="play" size={32} color="black" />
            </TouchableOpacity>
          )}
  
          <TouchableOpacity onPress={handle10SecondsForward}>
            <Ionicons name="play-forward-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
  

      </View>
    </Modal>
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
  mindsetText: {
    fontFamily: "GothicNeo",
    color: 'white',
    fontSize: 20
  },
  headerRoundedRectangle: {
    backgroundColor: '#323232',  // Change this to your desired background color
    borderRadius: 10,  // Adjust this value for the amount of roundness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,  // For Android shadow
    height: screenHeight * 0.25,  // Set height to 20% of the screen height,
    zIndex: 2
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 60
  },
  quoteContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
  currentDayText: {
    fontFamily: "GothicNeo",
    color: 'black',
    fontSize: 20,
    paddingBottom: 10,
  },
  quatationText: {
    fontFamily: "Anonymous_Pro_B",
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold'
  },
  quoteText: {
    fontFamily: "Anonymous_Pro_B",
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
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
    width: 45, // Ensures uniform width for each day/date
    alignItems: 'center', // Center day and date vertically
    paddingVertical: 10, // Add padding around the text
  },
  SelectedDayDateWrapper: {
    backgroundColor: '#555', // Darker background for selected date
    borderRadius: 10, // Rounded corners for selected date
  },
  DayText: {
    fontFamily: "GothicNeo",
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  SelectedDayText: {
    color: '#fff', // White text color for selected day
  },
  DateText: {
    fontFamily: "GothicNeo",
    fontSize: 17,
    color: '#555',
    marginTop: 5, // Adds a gap between day and date
  },
  SelectedDateText: {
    color: '#fff', // White text color for selected date
  },
  NonSelectableDate: {
    color: 'gray', // White text color for selected date
  },
  TaskContainer: {
    flex: 1, // Takes up all available space in its parent (container)
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  TaskRoundedRectangles: {
    
    display: 'flex',
    flexDirection: 'column',
    gap: 5 /* Adds 20px space between flex items */
  },
  horizontalRoundedRectangle: {
    flexDirection: 'row', // Ensures that the rectangles and text are laid out horizontally
    alignItems: 'center', // Aligns items vertically centered
    height: 10,
    width: 2,
    backgroundColor: 'black',
    borderRadius: 1, // Rounded edges
    marginRight: 10, // Space between the second rectangle and text
    marginBottom: 10,
  },
  rectTall: {
    height: 20,
    width: 3,
    backgroundColor: 'black',
    borderRadius: 1, // Rounded edges
    marginRight: 5, // Space between the rectangles
  },
  rectShort: {
    height: 10,
    width: 3,
    backgroundColor: 'black',
    borderRadius: 1, // Rounded edges
    marginRight: 10, // Space between the second rectangle and text
  },
  rectShortUnderneath: {
    height: 10,
    width: 2,
    backgroundColor: 'black',
    borderRadius: 1, // Rounded edges
    marginRight: 10, // Space between the second rectangle and text
  },
  text: {
    fontSize: 16,
  },
  taskParentContainer: {
    position: "relative",  // relative positioning for the container
    width: '100%',         // specify the width if needed
    height: 200,           // specify the height if needed
  },
  taskRoundedRectangle: {
    backgroundColor: 'white', 
    borderRadius: 20,
    width: '100%',         // make sure both rectangles have the same width
    height: '50%',         // adjust height to make it smaller than the green one
    zIndex: 1,             // ensure the task rectangle appears on top
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleAndSubtitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  playButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 20
  },
  greenRoundedRectangle: {
    position: "absolute",  // allow overlapping
    top: 0,
    left: 0,
    backgroundColor: 'green', 
    borderRadius: 20,
    width: '100%',
    height: '50%',         // adjust height to make it the same as the gray one
    zIndex: 0,             // the green rectangle will be behind
  },
  completedTaskRoundedRectangle: {
    flex: 1, // Takes up all available space in its parent (container)
    backgroundColor: 'green',
    borderRadius: 20, // Adjust this to make the rectangle more or less rounded
    width: '100%',
    height: '50%',         // adjust height to make it the same as the gray one
    zIndex: 0,             // the green rectangle will be behind
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  playButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flex: 0.6, // This makes the image container take up 25% of the width
    justifyContent: 'center',
    alignItems: 'center', // Center the image within the container
    borderRadius: 15,
    overflow: 'hidden', // Clip the image to the rounded container
  },
  image: {
    width: '100%',
    height: '100%', // Ensure the image fills the container
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
  },
  modalImage: {
    height: 200,
    width: 200,
    borderRadius: 20,
    marginTop: 60, // Ensures space for the back button
  },
  modalText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: 'gray',
  },
  slider: {
    width: '80%',
    height: 40,
    marginVertical: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    marginVertical: 20,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    fontSize: 4,
    paddingTop: 20
  },
});
