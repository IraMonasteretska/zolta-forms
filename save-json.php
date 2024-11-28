<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input'); // Отримання даних
    $data = json_decode($json, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        // Отримання назви форми
        $formName = $data['form_name'] ?? 'unknown_form';

        // Видалення form_name з даних, щоб не дублювалось у файлі
        unset($data['form_name']);

        // Шлях до папки forms_data у корені проекту
        $directory = __DIR__ . '/forms_data';

        // Створення папки, якщо вона не існує
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true); // Рекурсивне створення з правами доступу 0777
        }

        // Унікальне ім'я файлу: назва форми + timestamp
        $fileName = $formName . '-' . date('Y-m-d_H-i-s') . '.json';
        $filePath = $directory . '/' . $fileName;

        // Збереження JSON у файл
        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT))) {
            echo "JSON successfully saved in forms_data as $fileName";
        } else {
            http_response_code(500);
            echo "Failed to save JSON file.";
        }
    } else {
        http_response_code(400);
        echo "Invalid JSON data.";
    }
} else {
    http_response_code(405);
    echo "Method not allowed. Use POST.";
}
