<?php
require_once 'config.php';

function createUser($name, $email, $phone, $role, $password) {
    global $conn;
    // In production, hash the password: password_hash($password, PASSWORD_DEFAULT)
    $stmt = $conn->prepare("INSERT INTO user_table (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $role, $password);
    $stmt->execute();
    return $stmt->insert_id;
}

function getUser($user_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM user_table WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllUsers() {
    global $conn;
    return $conn->query("SELECT * FROM user_table")->fetch_all(MYSQLI_ASSOC);
}

function updateUser($user_id, $name, $email, $phone, $role, $password) {
    global $conn;
    // If password is not being changed, you might omit it. Here we always update.
    $stmt = $conn->prepare("UPDATE user_table SET name=?, email=?, phone=?, role=?, password=? WHERE user_id=?");
    $stmt->bind_param("sssssi", $name, $email, $phone, $role, $password, $user_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteUser($user_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM user_table WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>