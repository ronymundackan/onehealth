<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$dbname = 'caresync';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Database connection failed']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['message' => 'Email and password are required']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Check if user exists
$query = "SELECT id, email, password, role FROM users WHERE email = :email";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':email', $email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful.',
        'role' => $user['role']
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid email or password.']);
}
?>
