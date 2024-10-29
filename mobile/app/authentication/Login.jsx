import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ToastAndroid,
    
} from "react-native";
import {
    TextInput,
    Button,
    Title,
    Paragraph,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from 'expo-router';
import { IpAddress } from "../IpAddressConfig";
import { colors } from "../style";
import { showToastWithGravityAndOffset } from "../ToastAndroid";
import { LoginService } from "../services/auth.service";
import { getItem } from "../AsyncStorage";
import stylessheet from "../style";

const Login = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    
    };    
    useEffect(() => {
        const token = getItem("accessToken").then((token) => {
            if(token){
                navigation.navigate("MyTabs");
            }
        })
      
    }, [])

    const onLogin = async () => {
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("*Email không được rỗng");
        }
        if (!password) {
            setPasswordError("*Mật khẩu không được rỗng");
        }

        if (email && password) {
           await LoginService(email, password, navigation);
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text.trim());
        if (text.trim()) {
            setEmailError("");
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text.trim());
        if (text.trim()) {
            setPasswordError("");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.text}>
                <Title style={styles.title}>Đăng nhập</Title>
            </View>
            <Paragraph style={styles.signupText}>
                Chưa có tài khoản?{" "}
                <Text style={{ color: colors.accentColor, fontWeight:'bold'}} onPress={() => navigation.navigate("authentication/Register")}>
                    Đăng ký
                </Text>
            </Paragraph>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, emailError ? styles.errorInput : {}]}
                    label="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, passwordError ? styles.errorInput : {}]}
                    label="Mật khẩu"
                    secureTextEntry={!showNewPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                <Pressable onPress={toggleNewPasswordVisibility} style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={!showNewPassword ? "eye-off" : "eye"}
                        size={20}
                        style={styles.eyeIcon}
                    />
                </Pressable>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.btnContainer}>
                <Button mode="contained" style={stylessheet.button} onPress={onLogin}>
                    Đăng nhập
                </Button>
            </View>
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
    signupText: {
        fontSize: 14,
        marginBottom: 10
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
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
    },
    btnContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    button: {
        width: "100%",
        backgroundColor: colors.primaryColor
    },
    iconContainer: {
        marginRight: 20,
        position: "absolute",
        right: 0,
        top: "40%",
    },
});

export default Login;
