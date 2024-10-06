import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Pressable,
} from "react-native";
import {
    TextInput,
    Button,
    Title,
    Caption,
    Paragraph,
    TouchableRipple,
    Checkbox,
} from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { storeToken, getAccessToken } from "../user-profile/getAccessToken";
// import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { fetchAllGroup } from "../../service/conversation.util";
import { Stack, useNavigation, Link, router } from 'expo-router';
import stylessheet from "../style";
import { loginService } from "../services/auth.service";
const Login = ({ }) => {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };
    const onPressCheckbox = () => {
        setChecked(!checked);
    };


    const validateEmail = (email) => {
        let re = /^[a-zA-Z0-9](?!.*[&=_'\-+<>])[\w.]{4,28}(?<![.])@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/;
        return re.test(email);
    }


    const onLogin = async () => {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
        })
        const data = await response.json();
        console.log(data);
    };
    

    return (
        <ScrollView style={styles.container}>
            <View style={styles.text}>
                <Title style={styles.title}>Đăng nhập</Title>
            </View>
            <Paragraph style={styles.signupText}>
               Chưa có tài khoản?{" "}

                <Text
                    style={stylessheet.accentText} onPress={() => {
                        navigation.navigate("authentication/Register");
                    }}                    >
                    Đăng ký
                </Text>


            </Paragraph>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, loginError && styles.errorInput]}
                    label="Email"
                    underlineColorAndroid="transparent"
                    value={email}
                    maxLength={40}
                    onChangeText={(text) => setEmail(text.trim())}
                />
            </View>
            <View
                style={{
                    marginBottom: 5,
                    flexDirection: "row",
                }}
            >
                <TextInput
                    style={[styles.input, loginError && styles.errorInput]}
                    label="Mật khẩu"
                    underlineColorAndroid="transparent"
                    secureTextEntry={!showNewPassword}
                    value={password}
                    onChangeText={(text) => setPassword(text.trim())}
                />
                <Pressable
                    onPress={toggleNewPasswordVisibility}
                    style={styles.iconContainer}
                >
                    <MaterialCommunityIcons
                        name={!showNewPassword ? "eye-off" : "eye"}
                        size={20}
                        style={styles.eyeIcon}
                    />

                </Pressable>
            </View>

            <View style={styles.btnContainer}>
                <Button mode="contained" style={stylessheet.button} onPress={() => {
                    onLogin();
                }} >
                    Đăng nhập
                </Button>
            </View>


            {/* // forgot password
            <View style={styles.forgetContainer}>
                <Pressable
                    onPress={() => {
                        if (email) {
                            navigation.navigate("ForgotPassword", { email: email });
                        }
                        else {
                            navigation.navigate("ForgotPassword", { email: '' });

                        }
                    }
                    }
                >
                    <Text style={styles.forgetText}>Forgot password?</Text>
                </Pressable>
            </View> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingTop: 150,
    },
    text: {
        alignItems: "left",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        paddingBottom: 20,
    },
    signupContainer: {

        alignItems: "left",

    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        color: "#f558a4",
        fontWeight: "bold",
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#f5f5f5",
        paddingLeft: 10,
        width: "100%",
    },
    errorInput: {
        backgroundColor: "#ffcccc",
        paddingLeft: 10,
    },
    checkContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    checkText: {
        fontSize: 14,
        marginLeft: 5,
    },
    btnContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    btn: {
        width: "100%",
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f558a4",
        justifyContent: "center",
    },
    forgetContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    forgetText: {
        color: "#f558a4",
        fontWeight: 500,
        fontSize: 15,
    },
    iconContainer: {
        marginRight: 20,
        position: "absolute",
        right: 0,
        top: "40%",
    },
});

export default Login;