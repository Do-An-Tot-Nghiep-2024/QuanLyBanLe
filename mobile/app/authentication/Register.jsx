import React, { useState } from "react"; 
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import {
    TextInput,
    Button,
    Title,
    Paragraph,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from 'expo-router';
import stylessheet from "../style";
import { RegisterService } from "../services/auth.service";

const Register = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword((prevState) => !prevState);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleRegister = async () => {
        setNameError("");
        setPhoneError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        let valid = true;

        if (!name) {
            setNameError("*Tên là bắt buộc.");
            valid = false;
        }

        if (!validateEmail(email)) {
            setEmailError("*Địa chỉ email không hợp lệ.");
            valid = false;
        }

        if (!validatePhone(phone)) {
            setPhoneError("*Số điện thoại phải có 10 chữ số.");
            valid = false;
        }

        if (!password) {
            setPasswordError("*Mật khẩu là bắt buộc.");
            valid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("*Mật khẩu không khớp.");
            valid = false;
        }

        if (!valid) return;

        const response = await RegisterService(name, email, phone, password, navigation);
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View style={styles.text}>
                    <Title style={styles.title}>Đăng ký</Title>
                </View>
                <View style={styles.signupContainer}>
                    <Paragraph style={styles.signupText}>
                        Đã có tài khoản?{" "}
                        <Text
                            style={stylessheet.accentText}
                            onPress={() => navigation.navigate("authentication/Login")}
                        >
                            Đăng nhập
                        </Text>
                    </Paragraph>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, nameError ? styles.errorInput : null]}
                        label="Họ và tên"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (text) setNameError(""); // Hide error on input
                        }}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, emailError ? styles.errorInput : null]}
                        label="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text.trim());
                            if (text) setEmailError(""); // Hide error on input
                        }}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, phoneError ? styles.errorInput : null]}
                        label="Số điện thoại"
                        keyboardType="number-pad"
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text.trim());
                            if (text) setPhoneError(""); // Hide error on input
                        }}
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, passwordError ? styles.errorInput : null]}
                        label="Mật khẩu"
                        secureTextEntry={!showNewPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text.trim());
                            if (text) setPasswordError(""); // Hide error on input
                        }}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    <Pressable onPress={toggleNewPasswordVisibility} style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={!showNewPassword ? "eye-off" : "eye"}
                            size={20}
                            style={styles.eyeIcon}
                        />
                    </Pressable>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, confirmPasswordError ? styles.errorInput : null]}
                        label="Nhập lại mật khẩu"
                        secureTextEntry={!showConfirmNewPassword}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text.trim());
                            if (text) setConfirmPasswordError(""); // Hide error on input
                        }}
                    />
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    <Pressable onPress={toggleConfirmNewPasswordVisibility} style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={!showConfirmNewPassword ? "eye-off" : "eye"}
                            size={20}
                            style={styles.eyeIcon}
                        />
                    </Pressable>
                </View>

                <View style={styles.btnContainer}>
                    <Button onPress={handleRegister} mode="contained" style={stylessheet.button}>
                        Đăng ký
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingTop: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        paddingBottom: 10,
    },
    signupContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
    input: {
        backgroundColor: "#f5f5f5",
        paddingLeft: 10,
        width: "100%",
    },
    errorInput: {
        backgroundColor: "#ffcccc",
    },
    btnContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    errorText: {
        color: "red",
        marginTop: 5,
    },
    iconContainer: {
        marginRight: 20,
        position: "absolute",
        right: 0,
        top: "40%",
    },
    eyeIcon: {
        color: '#888',
    },
});

export default Register;
