<?php
session_start(); 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *'); 
date_default_timezone_set('Asia/Bangkok'); 

include('../conn.php');
include('../src/JWT.php');
use Firebase\JWT\JWT;

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true); 

if ( !isset($_POST['username'], $_POST['password']) ) {
	exit($_POST['username']);
}
// echo $_POST['username'];
if ($stmt = $conn->prepare('SELECT firstname,lastname,code,password,type,status FROM user WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	// Store the result so we can check if the account exists in the database.
	$stmt->store_result();
}
if ($stmt->num_rows > 0) {
	$stmt->bind_result($firstname,$lastname,$code,$password,$type,$status);
	$stmt->fetch();

	// Account exists, now we verify the password.
	// Note: remember to use password_hash in your registration file to store the hashed passwords.
	if (password_verify($_POST['password'], $password)) {
		if($status=='Y')
		{
			// session_regenerate_id();
			$sKey = vsprintf('C%s%s-%s', str_split(bin2hex(random_bytes(16)), 8));
			$_SESSION['loggedin'] = TRUE;
			$_SESSION['name'] = $_POST['username'];
			$_SESSION['id'] = $code;
			$_SESSION['firstname'] = $firstname;
			$_SESSION['lastname'] = $lastname;
			$_SESSION['type'] = $type;	
			$_SESSION['skey'] = $sKey;	
			
			$secretKey = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
			$issuedAt = new DateTimeImmutable();
			$expire = $issuedAt->modify('+60 minutes')->getTimestamp();      // Add 60 seconds
			$serverName = "oc";
			$username = $_POST['username'];
			$userid = $code; 
			$data = [
				'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
				'iss'  => $serverName,                       // Issuer
				'nbf'  => $issuedAt->getTimestamp(),         // Not before
				'exp'  => $expire,                           // Expire
				'username' => $username,                     // User name
				'userid' => $userid,                         // User Id
				'expd' => $issuedAt->modify('+60 minutes') //test
			];
			
			$jwt = JWT::encode($data,$secretKey,'HS512');
			// echo 'Welcome ' . $_SESSION['name'] . '!';
			echo json_encode(array('status' => '1','message'=> 'สำเร็จ', "token" => $jwt));
		}
		else{
			echo json_encode(array('status' => '0','message'=> 'User นี้ถูกยกเลิกการใช้งานแล้ว'));
		}
	} else {
		echo json_encode(array('status' => '0','message'=> 'Password ไม่ถูกต้อง'));		
	}
} else {
	echo json_encode(array('status' => '0','message'=> 'Username ไม่ถูกต้อง'));	
}
 