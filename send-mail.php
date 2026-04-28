<?php
use PHPMailer\PHPMailer\PHPMailer;
require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->Username = 'tranvi04nb@gmail.com';
        $mail->Password = 'pbwh vwae nker xwqi';

        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('tranvi04nb@gmail.com', 'Central Riverside');
        $mail->addAddress('quangkienbds@gmail.com');
//        $mail->addAddress('lequyhieu1024@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = 'Khách đăng ký tư vấn';
        $mail->Body = "
            <p>Họ tên: $name</p>
            <p>SĐT: $phone</p>
        ";

        $mail->send();
        echo "<script>
        alert('Gửi thành công');
        window.location.href='/';
        </script>";
        exit;

    } catch (Exception $e) {
        echo "Lỗi: {$mail->ErrorInfo}";
    }
}