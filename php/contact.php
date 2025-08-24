<?php
/**
 * Manejador del Formulario de Contacto
 * Archivo: php/contact.php
 * 
 * Este archivo procesa los datos del formulario de contacto
 * y envía el email correspondiente.
 */

// Configuración
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo permitir métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Configuración del email
define('RECIPIENT_EMAIL', 'Jair_15_01@hotmail.com'); // Cambiar por tu email
define('RECIPIENT_NAME', 'Eduardo Cruz');
define('SMTP_FROM', 'Jair_15_01@hotmail.com'); // Cambiar por tu dominio

/**
 * Función para limpiar y validar los datos de entrada
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Función para validar email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Función para validar los datos del formulario
 */
function validateFormData($data) {
    $errors = [];
    
    // Validar nombre
    if (empty($data['name']) || strlen($data['name']) < 2) {
        $errors[] = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar email
    if (empty($data['email'])) {
        $errors[] = 'El email es requerido';
    } elseif (!validateEmail($data['email'])) {
        $errors[] = 'El email no es válido';
    }
    
    // Validar asunto
    if (empty($data['subject']) || strlen($data['subject']) < 5) {
        $errors[] = 'El asunto debe tener al menos 5 caracteres';
    }
    
    // Validar mensaje
    if (empty($data['message']) || strlen($data['message']) < 10) {
        $errors[] = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    return $errors;
}

/**
 * Función para crear el contenido HTML del email
 */
function createEmailHTML($data) {
    $html = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo mensaje del portafolio</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .field {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            .field-label {
                font-weight: 600;
                color: #2563eb;
                margin-bottom: 5px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value {
                font-size: 16px;
                color: #333;
                word-wrap: break-word;
            }
            .message-content {
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 15px;
                font-style: italic;
                line-height: 1.8;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
                border-top: 1px solid #e9ecef;
            }
            .meta-info {
                margin-top: 20px;
                padding: 15px;
                background: #e3f2fd;
                border-radius: 6px;
                font-size: 12px;
                color: #1976d2;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Nuevo mensaje del portafolio</h1>
                <p>Has recibido un nuevo mensaje de contacto</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="field-label">Nombre</div>
                    <div class="field-value">' . htmlspecialchars($data['name']) . '</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">
                        <a href="mailto:' . htmlspecialchars($data['email']) . '" style="color: #2563eb; text-decoration: none;">
                            ' . htmlspecialchars($data['email']) . '
                        </a>
                    </div>
                </div>
                
                <div class="field">
                    <div class="field-label">Asunto</div>
                    <div class="field-value">' . htmlspecialchars($data['subject']) . '</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Mensaje</div>
                    <div class="message-content">' . nl2br(htmlspecialchars($data['message'])) . '</div>
                </div>
                
                <div class="meta-info">
                    <strong>Información adicional:</strong><br>
                    📅 Fecha: ' . date('d/m/Y H:i:s') . '<br>
                    🌐 IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible') . '<br>
                    📱 User Agent: ' . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'No disponible') . '
                </div>
            </div>
            
            <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto de tu portafolio web.</p>
                <p>📌 <strong>Tip:</strong> Puedes responder directamente a este email.</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

/**
 * Función para crear el contenido de texto plano del email
 */
function createEmailText($data) {
    $text = "NUEVO MENSAJE DEL PORTAFOLIO\n";
    $text .= str_repeat("=", 50) . "\n\n";
    $text .= "NOMBRE: " . $data['name'] . "\n";
    $text .= "EMAIL: " . $data['email'] . "\n";
    $text .= "ASUNTO: " . $data['subject'] . "\n\n";
    $text .= "MENSAJE:\n";
    $text .= str_repeat("-", 20) . "\n";
    $text .= $data['message'] . "\n";
    $text .= str_repeat("-", 20) . "\n\n";
    $text .= "INFORMACIÓN ADICIONAL:\n";
    $text .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
    $text .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible') . "\n";
    $text .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'No disponible') . "\n";
    
    return $text;
}

/**
 * Función para enviar el email usando PHP mail()
 */
function sendEmailWithPHPMail($data) {
    $to = RECIPIENT_EMAIL;
    $subject = '📧 Nuevo mensaje del portafolio: ' . $data['subject'];
    $message = createEmailHTML($data);
    
    $headers = array(
        'From: ' . $data['name'] . ' <' . SMTP_FROM . '>',
        'Reply-To: ' . $data['email'],
        'Return-Path: ' . SMTP_FROM,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit'
    );
    
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    return $success;
}

/**
 * Función para enviar email de confirmación al usuario
 */
function sendConfirmationEmail($data) {
    $to = $data['email'];
    $subject = '✅ Confirmación: Tu mensaje ha sido enviado - ' . RECIPIENT_NAME;
    
    $message = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px 0; }
            .footer { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px; text-align: center; font-size: 14px; color: #6c757d; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>¡Gracias por contactarme!</h2>
            </div>
            <div class="content">
                <p>Hola <strong>' . htmlspecialchars($data['name']) . '</strong>,</p>
                <p>He recibido tu mensaje correctamente y te responderé lo antes posible.</p>
                <p><strong>Tu mensaje:</strong></p>
                <blockquote style="background: #f8f9fa; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; font-style: italic;">
                    ' . nl2br(htmlspecialchars($data['message'])) . '
                </blockquote>
                <p>Normalmente respondo en un plazo de 24-48 horas.</p>
                <p>¡Que tengas un excelente día!</p>
                <p><strong>' . RECIPIENT_NAME . '</strong></p>
            </div>
            <div class="footer">
                <p>Este es un mensaje automático, por favor no respondas a este email.</p>
            </div>
        </div>
    </body>
    </html>';
    
    $headers = array(
        'From: ' . RECIPIENT_NAME . ' <' . SMTP_FROM . '>',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    );
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

/**
 * Función para registrar en log (opcional)
 */
function logContactForm($data, $success) {
    $logFile = __DIR__ . '/contact_log.txt';
    $logEntry = date('Y-m-d H:i:s') . ' | ' . 
                $data['name'] . ' | ' . 
                $data['email'] . ' | ' . 
                ($success ? 'SUCCESS' : 'FAILED') . ' | ' . 
                ($_SERVER['REMOTE_ADDR'] ?? 'Unknown IP') . "\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ============================================
// PROCESAMIENTO PRINCIPAL
// ============================================

try {
    // Obtener y limpiar los datos del formulario
    $formData = [
        'name' => sanitizeInput($_POST['name'] ?? ''),
        'email' => sanitizeInput($_POST['email'] ?? ''),
        'subject' => sanitizeInput($_POST['subject'] ?? ''),
        'message' => sanitizeInput($_POST['message'] ?? '')
    ];
    
    // Validar los datos
    $errors = validateFormData($formData);
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error en los datos del formulario',
            'errors' => $errors
        ]);
        exit;
    }
    
    // Protección básica contra spam (honeypot)
    if (!empty($_POST['website'])) { // Campo oculto
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Spam detectado'
        ]);
        exit;
    }
    
    // Rate limiting básico (opcional)
    $rateLimitFile = sys_get_temp_dir() . '/contact_rate_limit_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    if (file_exists($rateLimitFile) && (time() - filemtime($rateLimitFile)) < 60) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Demasiados intentos. Espera un minuto antes de enviar otro mensaje.'
        ]);
        exit;
    }
    file_put_contents($rateLimitFile, time());
    
    // Enviar email principal
    $emailSent = sendEmailWithPHPMail($formData);
    
    if ($emailSent) {
        // Enviar email de confirmación (opcional)
        sendConfirmationEmail($formData);
        
        // Registrar en log
        logContactForm($formData, true);
        
        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => '¡Mensaje enviado correctamente! Te responderé pronto.'
        ]);
        
    } else {
        // Error al enviar email
        logContactForm($formData, false);
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje. Por favor, inténtalo más tarde o contacta directamente por email.'
        ]);
    }
    
} catch (Exception $e) {
    // Error inesperado
    error_log('Error en contact.php: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.'
    ]);
}

// ============================================
// CONFIGURACIÓN ADICIONAL PARA PRODUCCIÓN
// ============================================

/**
 * Para usar en producción, considera las siguientes mejoras:
 * 
 * 1. SMTP con PHPMailer:
 *    - Instalar: composer require phpmailer/phpmailer
 *    - Configurar SMTP (Gmail, SendGrid, etc.)
 * 
 * 2. Base de datos para logs:
 *    - Crear tabla: contacts (id, name, email, subject, message, ip, created_at)
 * 
 * 3. Captcha:
 *    - Implementar Google reCAPTCHA
 * 
 * 4. Validaciones avanzadas:
 *    - Verificar MX records del dominio del email
 *    - Detectar emails temporales
 * 
 * 5. Rate limiting avanzado:
 *    - Usar Redis o base de datos
 * 
 * 6. Notificaciones:
 *    - Slack, Discord, Telegram webhooks
 */

/*
// EJEMPLO DE CONFIGURACIÓN CON PHPMAILER (descomenta para usar)

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once 'vendor/autoload.php';

function sendEmailWithPHPMailer($data) {
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Cambiar según tu proveedor
        $mail->SMTPAuth   = true;
        $mail->Username   = 'tu@email.com';   // Tu email
        $mail->Password   = 'tu_password';    // Tu password o app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        
        // Configuración del email
        $mail->setFrom(SMTP_FROM, 'Portafolio Web');
        $mail->addAddress(RECIPIENT_EMAIL, RECIPIENT_NAME);
        $mail->addReplyTo($data['email'], $data['name']);
        
        $mail->isHTML(true);
        $mail->Subject = '📧 Nuevo mensaje del portafolio: ' . $data['subject'];
        $mail->Body    = createEmailHTML($data);
        $mail->AltBody = createEmailText($data);
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Error PHPMailer: {$mail->ErrorInfo}");
        return false;
    }
}
*/

/*
// EJEMPLO DE INSERCIÓN EN BASE DE DATOS (descomenta para usar)

function saveToDatabase($data) {
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=portfolio', $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $pdo->prepare("
            INSERT INTO contacts (name, email, subject, message, ip_address, user_agent, created_at) 
            VALUES (:name, :email, :subject, :message, :ip, :user_agent, NOW())
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':subject' => $data['subject'],
            ':message' => $data['message'],
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
        
        return $pdo->lastInsertId();
        
    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        return false;
    }
}
*/

/*
// EJEMPLO DE WEBHOOK PARA SLACK (descomenta para usar)

function notifySlack($data) {
    $webhookUrl = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';
    
    $message = [
        'text' => '📧 Nuevo mensaje del portafolio',
        'attachments' => [
            [
                'color' => 'good',
                'fields' => [
                    [
                        'title' => 'Nombre',
                        'value' => $data['name'],
                        'short' => true
                    ],
                    [
                        'title' => 'Email',
                        'value' => $data['email'],
                        'short' => true
                    ],
                    [
                        'title' => 'Asunto',
                        'value' => $data['subject'],
                        'short' => false
                    ],
                    [
                        'title' => 'Mensaje',
                        'value' => substr($data['message'], 0, 200) . '...',
                        'short' => false
                    ]
                ]
            ]
        ]
    ];
    
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result !== false;
}
*/

/*
// EJEMPLO DE VALIDACIÓN AVANZADA DE EMAIL (descomenta para usar)

function validateEmailDomain($email) {
    $domain = substr(strrchr($email, "@"), 1);
    
    // Verificar si el dominio tiene registros MX
    return checkdnsrr($domain, 'MX');
}

function isDisposableEmail($email) {
    $disposableDomains = [
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
        'mailinator.com', 'yopmail.com', 'temp-mail.org'
        // Agregar más dominios de emails temporales
    ];
    
    $domain = substr(strrchr($email, "@"), 1);
    return in_array(strtolower($domain), $disposableDomains);
}
*/

// ============================================
// SCRIPT DE INSTALACIÓN (crear archivo separado: install.php)
// ============================================

/*
<?php
// install.php - Ejecutar una sola vez para configurar

echo "Configurando portafolio...\n";

// Crear directorios necesarios
$dirs = ['logs', 'uploads', 'cache'];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        echo "✓ Directorio $dir creado\n";
    }
}

// Crear archivo de configuración
$config = '<?php
define("DB_HOST", "localhost");
define("DB_NAME", "portfolio");
define("DB_USER", "tu_usuario");
define("DB_PASS", "tu_password");

define("SMTP_HOST", "smtp.gmail.com");
define("SMTP_USER", "tu@email.com");
define("SMTP_PASS", "tu_password");
define("SMTP_PORT", 587);

define("RECIPIENT_EMAIL", "tu@email.com");
define("RECIPIENT_NAME", "Tu Nombre");

define("SITE_URL", "https://tudominio.com");
define("SITE_NAME", "Tu Portafolio");
';

file_put_contents('config.php', $config);
echo "✓ Archivo de configuración creado\n";

// Crear tabla de base de datos (si usas MySQL)
$sql = "
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);";

echo "SQL para crear tabla:\n$sql\n";
echo "✓ Instalación completada\n";
*/

// ============================================
// ARCHIVO .HTACCESS RECOMENDADO
// ============================================

/*
# .htaccess - Configuraciones de seguridad y rendimiento

# Seguridad
Options -Indexes
Options -ExecCGI
ServerSignature Off

# Proteger archivos sensibles
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|inc|bak|config|sql)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Headers de seguridad
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:;"
</IfModule>

# Compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# URL Rewrite (si usas URLs amigables)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
*/

?>