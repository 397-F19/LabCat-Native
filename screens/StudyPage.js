import React from 'react';
import { withNavigation } from 'react-navigation';
import {StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, Platform} from 'react-native';
import { Block, Text, theme, Button } from 'galio-framework';

import materialTheme from '../constants/Theme';
import {HeaderHeight} from "../constants/utils";

const { width } = Dimensions.get('screen');

const StudyPage = ({navigation}) => {
    const study = navigation.getParam('study');
    return (
        <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.studies}
        >
            <Block flex style={styles.studyPage}>
                <Text h3>{study.title}</Text>
            </Block>

            <Block flex style={styles.studyPage}>
                <Text p>{study.description}</Text>
            </Block>
            <Block center>
                <Button round size="small">Register Study!</Button>
            </Block>
        </ScrollView>
    );
};

export default StudyPage;

const styles = StyleSheet.create({
    studies: {
        width: width,
        paddingVertical: theme.SIZES.BASE * 2,
        marginTop: HeaderHeight,
        backgroundColor: theme.COLORS.WHITE,
    },
    studyPage: {
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        width: width - theme.SIZES.BASE * 2,
        marginHorizontal: 20
    },
});
