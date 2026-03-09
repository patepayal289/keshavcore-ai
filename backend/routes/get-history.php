<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../config/database.php';

$email = $_POST['email'] ?? '';

if (empty($email)) {
    echo json_encode([]);
    exit();
}

// Get user id
$stmtUser = $conn->prepare("SELECT id FROM users WHERE email=?");
$stmtUser->execute([$email]);
$user = $stmtUser->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode([]);
    exit();
}

$userId = $user['id'];

// ✅ IMPORTANT: Include id
$stmt = $conn->prepare(
    "SELECT id, prompt, result, created_at
     FROM generations
     WHERE user_id=?
     ORDER BY created_at DESC"
);

$stmt->execute([$userId]);

$history = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($history);
?>
