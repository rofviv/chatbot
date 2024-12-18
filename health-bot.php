<?php

function checkHealth() {
    $ch = curl_init('http://localhost:7000/health');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Si la primera URL falla, intentar la segunda
    if ($response === false || $httpCode !== 200) {
        $ch = curl_init('https://www.patio-driver.patiodelivery2.com/api/notification/send/group/whatsapp');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            "group" => "SOPORTE PATIOSERVICE",
            "message" => "*ATENCION BOT DE KIKY SIN SERVICIO TOMAR ATENCION*"
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInVzZXJuYW1lIjoibWF0dUBnbWFpbC5jb20iLCJpYXQiOjE3MjY3NTgzNDUsImV4cCI6MTc1ODI5NDM0NX0.t_6GAPUfdiK3HsAi6mV3RLZawT58xoo5zSdxMzX-2-Q',
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return [
            'success' => ($response !== false && $httpCode === 200),
            'url' => 'https://www.patio-driver.patiodelivery2.com/api/notification/send/goup/whatsapp',
            'response' => $response
        ];
    }

    return [
        'success' => true,
        'url' => 'localhost:7000/health',
        'response' => $response
    ];
}

// Ejecutar la verificación
$result = checkHealth();
echo json_encode($result, JSON_PRETTY_PRINT);
