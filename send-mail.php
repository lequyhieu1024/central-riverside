<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);

    $to = "quangkienbds@gmail.com";
    $subject = "Khách đăng ký tư vấn Central Riverside";

    $message = "
    <h3>Thông tin khách hàng:</h3>
    <p><strong>Họ tên:</strong> $name</p>
    <p><strong>SĐT:</strong> $phone</p>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: website@yourdomain.com";

    if(mail($to, $subject, $message, $headers)) {
        echo "<script>alert('Gửi thành công!'); window.history.back();</script>";
    } else {
        echo "<script>alert('Gửi thất bại!'); window.history.back();</script>";
    }
}
?>