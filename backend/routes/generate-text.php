<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $prompt = $_POST['prompt'] ?? '';
    $email = $_POST['email'] ?? '';

    if (empty($prompt) || empty($email)) {
        echo "Missing data.";
        exit();
    }

    // 🔥 Get user id
    $stmtUser = $conn->prepare("SELECT id FROM users WHERE email=?");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "User not found.";
        exit();
    }

    $userId = $user['id'];

    // 🔥 OpenRouter API
    $apiKey = "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";

    $data = [
        "model" => "openai/gpt-3.5-turbo",
        "messages" => [
            ["role" => "user", "content" => $prompt]
        ]
    ];

    $ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);

    if (!isset($result['choices'][0]['message']['content'])) {
        echo "AI Error.";
        exit();
    }

    $generatedText = $result['choices'][0]['message']['content'];

    // 🔥 Save to database
    $stmtSave = $conn->prepare(
        "INSERT INTO generations (user_id, type, prompt, result)
         VALUES (?, 'text', ?, ?)"
    );

    $stmtSave->execute([$userId, $prompt, $generatedText]);

    echo $generatedText;
}
?>
