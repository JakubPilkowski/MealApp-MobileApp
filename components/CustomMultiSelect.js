import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, Platform, TouchableNativeFeedback, TouchableOpacity, Modal, Keyboard, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
import { Entypo, MaterialIcons, MaterialCommunityIcons } from "react-native-vector-icons";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
const { width, height } = Dimensions.get("screen");


const CustomMultiSelect = props => {

    const [searchViewValue, setSearchViewValue] = useState("");
    const [visibility, setVisisbility] = useState(false);
    const [items, setItems] = useState(props.items);
    const [searchResults, setSearchResults] = useState(items);
    const [errorEnabled, setErrorEnabled] = useState(false);
    const [chosenItems, setChosenItems] = useState([]);
    const [chosenColors, setChosenColors] = useState([]);
    const colors = ['crimson', 'darkgreen', 'slategray', 'darkmagenta', 'darkorange', 'darkturquoise', 'hotpink'];
    const onAddItemHandler = (item, index) => {
        if (item.selected === true) {
            count--;
            let newArray = [...items];
            let arrayIndex;
            newArray.map((arrayItem, index) => {
                if (arrayItem.name === item.name) {
                    arrayIndex = index;
                }
            })
            newArray[arrayIndex].selected = !item.selected;
            setSearchResults(newArray);
            setChosenItems(currentItems => {
                return currentItems.filter((chosenItem) => chosenItem.id !== item.id);
            });
            setChosenColors(currentColors => {
                return currentColors.filter((chosenColor) => chosenColor.id !== item.id);
            });
        }
        else {
            if (count < 3) {
                let newArray = [...items];
                let arrayIndex;
                newArray.map((arrayItem, index) => {
                    if (arrayItem.name === item.name) {
                        arrayIndex = index;
                    }
                });
                newArray[arrayIndex].selected = !item.selected;
                setSearchResults(newArray);
                setChosenItems(currentItems => [...currentItems, { id: item.id, name: item.name, selected: !item.selected, color: item.color }]);
            }
            else {
                setSearchViewValue('');
                setSearchResults(items);
                setErrorEnabled(true);
                setTimeout(function () {
                    setErrorEnabled(false);
                }, 700)
            }
        }

    }
    let count = 0;
    let selectedItems = items.map((item) => {
        if (item.selected === true) {
            count++;
        }
    });

    function applyFilter(text) {
        setSearchViewValue(text);
        if (text !== "") {
            const filterResults = items.filter(item => {
                const itemData = item.name.toLowerCase();
                const searchResult = text.toLowerCase();
                return itemData.indexOf(searchResult) > -1;
            });
            setSearchResults(filterResults);
        }
        else {
            setSearchResults(items);
        }
    }

    let input;
    let multiSelect =

        <Modal
            visible={visibility}
            transparent={true}
            animationType={"fade"}>
            <View style={{ margin: 20, marginVertical: 125, minHeight: height - 290, alignSelf: "center", backgroundColor: Colors.backgroundColor, padding: 12, borderRadius: 6, borderColor: Colors.primary, borderWidth: 2 }}>
                <Text style={{ color: Colors.colorTextDark, fontSize: 18, textAlign: "center" }}>Wybierz intersujące dania</Text>
                <SearchBar
                    onCancel={() => { setSearchResults(items); }}
                    placeholder="Wyszukaj..."
                    platform="android"
                    inputStyle={{ fontSize: 16 }}
                    onFocus={() => { applyFilter(searchViewValue) }}
                    onSubmitEditing={() => { setSearchResults(items) }}
                    containerStyle={{ borderTopLeftRadius: dimensions.defaultBorderRadius, marginBottom: 12, borderTopEndRadius: dimensions.defaultBorderRadius }}
                    onChangeText={(text) => applyFilter(text)}
                    value={searchViewValue}
                />
                <Text style={{ textAlign: 'center', fontSize: 14, color: 'red', marginBottom: 6, opacity: errorEnabled ? 1 : 0 }}>Dodałeś już 3 tagi!!!</Text>
                <KeyboardAwareFlatList
                    keyboardShouldPersistTaps='handled'
                    style={{
                        height: items.length <= 4 ? items.length * 52 : 208,
                        width: width - 36 * 2
                    }}
                    data={searchResults} renderItem={({ item, index }) => {
                        return (
                            <TouchableNativeFeedback onPress={() => {
                                onAddItemHandler(item, index);
                                Keyboard.dismiss();
                            }}
                            >
                                <View style={{
                                    height: 40, width: width - 40 * 2, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
                                    borderWidth: 2, borderColor: Colors.accent, borderRadius: 6, paddingHorizontal: 3, marginBottom: 12
                                }}>
                                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                    <View style={{ opacity: item.selected ? 1 : 0 }}>
                                        <Entypo size={24} color={Colors.primary} name="check" />
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        )
                    }}
                />
                <View style={{ borderWidth: 2, borderColor: Colors.primary, borderRadius: 6, paddingVertical: 6, }} >
                    <TouchableOpacity onPress={() => { setVisisbility(false) }}>
                        <Text style={{ textAlign: 'center', color: Colors.primary, fontSize: 16, fontWeight: 'bold' }}>Potwierdź</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>;
    let chosenItemsContent =
        <View style={{ marginTop: 6, height: chosenItems.length < 3 ? chosenItems.length * 46 : 138 }}>
            <FlatList
                data={chosenItems}
                renderItem={({ item, index }) => {
                    if (item.color === 'black') {
                        let colorIndex = Math.floor(Math.random() * (Math.floor(7) - Math.ceil(0))) + Math.ceil(0);
                        while (chosenColors.filter(item => { return item.color !== colors[colorIndex] }).length === chosenColors.length - 1) {
                            colorIndex = Math.floor(Math.random() * (Math.floor(7) - Math.ceil(0))) + Math.ceil(0);
                        }
                        chosenItems[index].color = colors[colorIndex];
                        setChosenColors(chosenColors => [...chosenColors, { id: item.id, color: colors[colorIndex] }]);
                    }
                    return (
                        <View style={{ height: 40, flexDirection: 'row', marginBottom: 6, borderRadius: 20, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3, borderColor: item.color, borderWidth: 2 }}>
                            <MaterialCommunityIcons name="food-variant" size={24} color={item.color} />
                            <Text style={{ fontSize: 16, color: item.color, textAlign: 'center' }}>{item.name}</Text>
                            <TouchableOpacity onPress={() => {
                                let newArray = [...items];
                                let arrayIndex;
                                newArray.map((arrayItem, index) => {
                                    if (arrayItem.id === item.id) {
                                        arrayIndex = index;
                                    }
                                })
                                newArray[arrayIndex].selected = false;
                                setSearchResults(newArray);
                                setChosenItems(currentItems => {
                                    return currentItems.filter((chosenItem) => chosenItem.id !== item.id);
                                });
                                setChosenColors(currentColors => {
                                    return currentColors.filter((chosenColor) => chosenColor.id !== item.id);
                                });
                            }}>
                                <MaterialIcons size={24} color={item.color} name="cancel" />
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </View>;
    if (Platform.OS === "android") {
        input =
            <View>
                <View style={[styles.mainContainer, props.inputContainer]}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(Colors.accent, true)}
                        onPress={() => { setVisisbility(true); }}
                        useForeground={false}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputPlaceHolder, props.placeHolderStyle]}>{props.placeHolder}</Text>
                            <View style={{ height: 20, width: 20, marginStart: 10, borderColor: Colors.primary, backgroundColor: Colors.accent, borderRadius: 10, borderWidth: 4 }} />
                        </View>
                    </TouchableNativeFeedback>
                    {multiSelect}
                </View>
                {chosenItemsContent}
            </View>
    }
    if (Platform.OS === "ios") {
        input =
            <View>
                <View style={[styles.mainContainer, props.inputContainer]}>
                    <TouchableOpacity
                        onPress={() => { setVisisbility(true); }}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputPlaceHolder, props.placeHolderStyle]}>{props.placeHolder}</Text>
                            <View style={{ height: 20, width: 20, marginStart: 10, borderColor: Colors.primary, backgroundColor: Colors.accent, borderRadius: 10, borderWidth: 4 }} />
                        </View>
                    </TouchableOpacity>
                    {multiSelect}
                </View>
                {chosenItemsContent}
            </View>
    }

    return (
        <View>
            {input}
        </View>
    )


}


const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.colorTextWhite,
        borderRadius: 20,
        justifyContent: 'center',

    },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderColor: Colors.accent,
        borderRadius: 20,
        borderWidth: dimensions.defaultBorderWidth,
        paddingVertical: dimensions.defaultSmallPadding,
        paddingHorizontal: dimensions.defaultPadding,
    },
    inputPlaceHolder: {
        textAlign: "center",
        color: Colors.primary,
        fontSize: dimensions.hugeFontSize,
        fontWeight: "bold",
    },
});

export default CustomMultiSelect;

