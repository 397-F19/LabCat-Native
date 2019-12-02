import React, { useState, useEffect } from "react";
import { withNavigation } from "react-navigation";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert
} from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import Hr from "react-native-hr-component";
import materialTheme from "../constants/Theme";
import { HeaderHeight } from "../constants/utils";
import COLORS from "galio-framework/src/theme/colors";
import db from "../firebase/fb";
import * as LocalAuthentication from 'expo-local-authentication';
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";


const { width, height } = Dimensions.get("screen");

const StudyPage = ({ navigation }) => {
  const study = navigation.getParam("study");
  const [ registerStudy, setRegisterStudy ] = useState(null);
  const [ calendar, setCalendar ] = useState(null);

  const authCalendar = async () => {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
      setCalendar(calendars);
    }
  };

  useEffect(()=> {
    if (registerStudy !== null && calendar !== null) {
      const startDate = new Date(registerStudy.start);
      const offset = [];
      calendar.map(tmp => {
        if (tmp.title === 'Calendar'){
          const cid = tmp.id;
          const details = {
          "title" : study.title,
          "startDate" : startDate,
          "endDate" : new Date(registerStudy.end),
          "location" : study.location,
          "alarms": [ {relativeOffset: -1440 } ]
          };
          const calid = Calendar.createEventAsync(cid,details);
        }
      })
    }

  }, [{registerStudy, calendar}]);

  const handlePress = event => {
    var uid = "001";
    var now = new Date();
    let time = event.times;
    let availableTime = time.filter(x => new Date(x.start) > now);
    const newPostKey = db
      .ref("users")
      .child(uid)
      .child("studies")
      .child(event.sid);
    Alert.alert(
      "Available Time",
      "please select an available time",
      [
        ...availableTime.map(x => ({
          text: `${x.start} to ${x.end}`,
          onPress: async() => {
            try {
              let results = await LocalAuthentication.authenticateAsync();
              if (results.success) {
                newPostKey.set(x);
                setRegisterStudy(x);
                await authCalendar();
                Alert.alert("Register Success");
              } else {
                Alert.alert(results.error);
              }
            } catch (e) {
              console.log(e);
            }
          }
        })),
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.studies}
        maximumZoomScale={2}
        minimumZoomScale={1}
        bouncesZoom={true}
      >
        <Block center style={styles.studyTitle}>
          <Text h4 style={styles.textBase}>
            {study.title}
          </Text>
        </Block>
        <Hr lineColor="#eee" width={width - theme.SIZES.BASE} text={"✨"} />
        <Block flex style={styles.studyContent}>
          <Text p style={styles.textContent}>
            <Text p style={styles.textKey}>
              Description:
            </Text>{" "}
            {study.description}
          </Text>
        </Block>
        <Block flex style={styles.studyContent}>
          <Text p style={styles.textContent}>
            <Text p style={styles.textKey}>
              Location:
            </Text>{" "}
            {study.location}
          </Text>
        </Block>
        <Block flex style={styles.studyContent}>
          <Text p style={styles.textContent}>
            <Text p style={styles.textKey}>
              Payment:
            </Text>{" "}
            {study.payment}
          </Text>
        </Block>
        <Block center style={styles.studyButton}>
          <Button round size="small" onPress={() => handlePress(study)}>
            Register Study!
          </Button>
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: HeaderHeight,
    height: height
  },
  studies: {
    width: width,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    backgroundColor: theme.COLORS.WHITE,
    height: height - HeaderHeight,
    marginTop: 15
  },
  studyTitle: {
    marginTop: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE,
    marginHorizontal: 20,
    marginBottom: 20
  },
  textBase: {
    fontFamily: "Cochin",
    fontWeight: "bold"
  },
  textContent: {
    fontFamily: "Georgia",
    lineHeight: 25,
    textAlign: "justify"
  },
  textKey: {
    fontWeight: "bold"
  },
  studyContent: {
    width: width - theme.SIZES.BASE * 4,
    marginVertical: 10
  },
  studyButton: {
    marginTop: 25,
    marginBottom: 30
  }
});

console.disableYellowBox = true;
