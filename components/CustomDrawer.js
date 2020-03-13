import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
class CustomDrawer extends Component {
    render() {
        return (
            <View style={styles.container}>
                <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                >
                    <ScrollView>
                        <SafeAreaView
                            forceInset={{ top: 'always', horizontal: 'never' }}
                        >
                            <DrawerItems {...this.props} />
                        </SafeAreaView>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
