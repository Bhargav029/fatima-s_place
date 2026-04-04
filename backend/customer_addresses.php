<?php
require_once 'config.php';

function createAddress($user_id, $address_line, $city, $landmark, $pincode, $state, $phone) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO customer_addresses (user_id, address_line, city, landmark, pincode, state, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $address_line, $city, $landmark, $pincode, $state, $phone);
    $stmt->execute();
    return $stmt->insert_id;
}

function getAddress($address_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM customer_addresses WHERE address_id = ?");
    $stmt->bind_param("i", $address_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllAddresses() {
    global $conn;
    return $conn->query("SELECT * FROM customer_addresses")->fetch_all(MYSQLI_ASSOC);
}

function updateAddress($address_id, $user_id, $address_line, $city, $landmark, $pincode, $state, $phone) {
    global $conn;
    $stmt = $conn->prepare("UPDATE customer_addresses SET user_id=?, address_line=?, city=?, landmark=?, pincode=?, state=?, phone=? WHERE address_id=?");
    $stmt->bind_param("issssssi", $user_id, $address_line, $city, $landmark, $pincode, $state, $phone, $address_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteAddress($address_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM customer_addresses WHERE address_id = ?");
    $stmt->bind_param("i", $address_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>