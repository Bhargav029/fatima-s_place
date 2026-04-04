<?php
require_once 'config.php';

function createReservation($user_id, $table_id, $reservation_time, $status) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO reservation_table (user_id, table_id, reservation_time, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $user_id, $table_id, $reservation_time, $status);
    $stmt->execute();
    return $stmt->insert_id;
}

function getReservation($reservation_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM reservation_table WHERE reservation_id = ?");
    $stmt->bind_param("i", $reservation_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllReservations() {
    global $conn;
    return $conn->query("SELECT * FROM reservation_table")->fetch_all(MYSQLI_ASSOC);
}

function updateReservation($reservation_id, $user_id, $table_id, $reservation_time, $status) {
    global $conn;
    $stmt = $conn->prepare("UPDATE reservation_table SET user_id=?, table_id=?, reservation_time=?, status=? WHERE reservation_id=?");
    $stmt->bind_param("iissi", $user_id, $table_id, $reservation_time, $status, $reservation_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteReservation($reservation_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM reservation_table WHERE reservation_id = ?");
    $stmt->bind_param("i", $reservation_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>