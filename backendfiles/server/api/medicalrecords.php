<?php
session_start(); // Start the session

header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "caresync";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Debugging: Check session user_id
error_log("Session user_id: " . $user_id);

$sql = "SELECT r.id, r.disease_name, r.date_diagnosed, r.prescriptions, r.still_on_medication,
               h.name AS hospital_name, d.name AS doctor_name, d.specialization 
        FROM records r
        JOIN hospitals h ON r.hospital_id = h.id
        JOIN doctors d ON r.doctor_id = d.id
        WHERE r.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$records = [];

while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

// Debugging: Check SQL query
error_log("SQL Query: " . $sql);

echo json_encode($records);

$conn->close();
?>
