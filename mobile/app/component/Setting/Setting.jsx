import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/app/style";

export default function Setting() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);
    const [isDialogVisible, setDialogVisible] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(true); 
    const [newPasswordVisible, setNewPasswordVisible] = useState(true); 
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true); 

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            console.log("Đổi mật khẩu thành công");
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordFormVisible(false); 
        } else {
            console.log("Mật khẩu mới không khớp");
        }
    };

    const handleLogOut = () => {
        console.log("Đăng xuất thành công");
    };

    // Function to toggle password visibility
    const toggleVisibility = (type) => {
        if (type === "password") {
            setPasswordVisible(!passwordVisible);
        } else if (type === "newPassword") {
            setNewPasswordVisible(!newPasswordVisible);
        } else if (type === "confirmPassword") {
            setConfirmPasswordVisible(!confirmPasswordVisible);
        }
    };

    const handleCancelChangePassword = () => {
        setPasswordFormVisible(false);
        setNewPassword("");
        setConfirmPassword("");
        setPassword("");
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cài đặt</Text>

            {/* Display "Change Password" and "Logout" as clickable text */}
            {!isPasswordFormVisible && (
                <>
                    <TouchableOpacity onPress={() => setPasswordFormVisible(true)}>
                        <Text style={styles.linkText}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDialogVisible(true)}>
                        <Text style={[styles.linkText, styles.logoutText]}>Đăng xuất</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Show the password change form if visible */}
            {isPasswordFormVisible && (
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Mật khẩu hiện tại"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={passwordVisible} // Hide password by default
                            style={styles.input}
                        />
                        <Pressable onPress={() => toggleVisibility("password")} style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name={passwordVisible ? "eye-off" : "eye"}
                                size={20}
                                style={styles.eyeIcon}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Mật khẩu mới"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={newPasswordVisible} // Hide new password by default
                            style={styles.input}
                        />
                        <Pressable onPress={() => toggleVisibility("newPassword")} style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name={newPasswordVisible ? "eye-off" : "eye"}
                                size={20}
                                style={styles.eyeIcon}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={confirmPasswordVisible} // Hide confirm password by default
                            style={styles.input}
                        />
                        <Pressable onPress={() => toggleVisibility("confirmPassword")} style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name={confirmPasswordVisible ? "eye-off" : "eye"}
                                size={20}
                                style={styles.eyeIcon}
                            />
                        </Pressable>
                    </View>

                    <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                        Đổi mật khẩu
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => handleCancelChangePassword()}
                        style={{ backgroundColor: 'lightgrey', marginTop: 10}}
                        
                    >
                        Hủy bỏ
                    </Button>
                </View>
            )}

            {/* Log out confirmation modal */}
            <Modal
                visible={isDialogVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setDialogVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
                        <Text style={styles.modalContent}>Bạn có chắc chắn muốn đăng xuất?</Text>
                        <View style={styles.modalActions}>
                            <Button onPress={() => setDialogVisible(false)} mode="outlined" style={styles.modalButton}>
                                Hủy bỏ
                            </Button>
                            <Button onPress={handleLogOut} mode="contained" style={styles.modalButton}>
                                Đồng ý
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    linkText: {
        fontSize: 22,
        color: "#007BFF",
        textDecorationLine: "underline", 
        textAlign: "center",
        marginTop: 10
    },
    logoutText: {
        color: "#f44336", 
    },
    formContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    inputContainer: {
        position: "relative",
        marginBottom: 15,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white'
    },
    button: {
        marginTop: 10,
        backgroundColor: colors.primaryColor
    },
    iconContainer: {
        position: "absolute",
        right: 10,
        top: "30%",
    },
    eyeIcon: {
        color: "#aaa", 
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalContent: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
    },
});
