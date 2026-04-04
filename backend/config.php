<?php
$servername = "localhost";
$username = "root";
$password = "newpassword";
$dbname = "fatima_place";

//create connection
$conn =new mysqli($servername, $username, $password, $dbname);

//check connection
if ($conn->connect_error){
    die("connection failed: " . $conn->connect_error);
}
?>
