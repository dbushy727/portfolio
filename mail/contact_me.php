<?php
/**
 * check for empty/invalid data
 * @param  array    $data   post data
 * @return boolean
 */
function validData($data)
{
    if (empty($value)) {
        echo "No arguments Provided!";
        return false;
    }

    if ($key == "email" && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid Email Address";
        return false;
    }
    return true;
}

/**
 * send an email
 * @param  string   $name    name from user
 * @param  string   $email   email address from user
 * @param  string   $phone   phone number from user
 * @param  string   $message message from user
 * @return void
 */
function sendMail($name, $email, $phone, $message)
{
    $headers        = "From: noreply@danielbushkanets.com\n";
    $headers        .= "Reply-To: $email_address";
    $to             = 'd.bushkanets@gmail.com';
    $email_subject  = "Portfolio Contact Form:  $name";
    $email_body     = "You have received a new message from your website contact form.\n\n"
                    . "Here are the details:\n\n
                        Name: $name\n\n
                        Email: $email_address\n\n
                        Phone: $phone\n\n
                        Message:\n$message";
    mail($to, $email_subject, $email_body, $headers);
}

if (!validData($_POST)) {
    return false;
}

$name           = $_POST['name'];
$email_address  = $_POST['email'];
$phone          = $_POST['phone'];
$message        = $_POST['message'];

sendMail($name, $email_address, $phone, $message);
return true;
