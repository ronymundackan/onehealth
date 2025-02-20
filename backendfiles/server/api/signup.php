<?php
// signup.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "caresync";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array("message" => "Database connection failed")));
}

// Get data from the request
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->fullName, $data->place, $data->email, $data->phoneNumber, $data->password)) {
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

$fullName = $data->fullName;
$place = $data->place;
$email = $data->email;
$phoneNumber = $data->phoneNumber;
$password = password_hash($data->password, PASSWORD_DEFAULT); // Hash the password

// Check if email already exists
$checkEmailQuery = "SELECT id FROM users WHERE email = ?";
$checkStmt = $conn->prepare($checkEmailQuery);
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(["message" => "Email already exists"]);
    exit;
}

// Insert new user
$sql = "INSERT INTO users (full_name, place, email, phone_number, password) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $fullName, $place, $email, $phoneNumber, $password);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "User registered successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error registering user."]);
}

$stmt->close();
$conn->close();

?>
