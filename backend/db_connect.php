<?php
// db_connect.php
$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "fatimas_place_db"; // You will need to create this database in phpMyAdmin

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed!"]));
}
?>