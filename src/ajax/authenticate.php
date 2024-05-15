<?php 
// include('./onload.php');
include_once( dirname(__FILE__, 1).'/src/JWT.php'); 
use Firebase\JWT\JWT; 
try{
    $isAuth = preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches) == 1;
    $jwt = $matches[1];
    
    // var_dump($jwt , $matches); 
    if (!$isAuth) {
        // 
        // http_response_code(400);
        // header('HTTP/1.0 400 Bad Request');
        echo 'Token not found in request';
        exit;
    }
    

    if (!$jwt) {
        // No token was able to be extracted from the authorization header
        header('HTTP/1.0 400 Bad Request');
        http_response_code(400);
        exit;
    }

    $secretKey  = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
    $token = JWT::decode($jwt, $secretKey, ['HS512']);
    $now = new DateTimeImmutable();
    $serverName = "oc";

    if ($token->iss !== $serverName ||
        $token->nbf > $now->getTimestamp() ||
        $token->exp < $now->getTimestamp())
    {
        header('HTTP/1.1 401 Unauthorized');
        exit;
    }    
} catch( Exception $e){
    
    header('HTTP/1.1 401 Unauthorized');
    echo("Token expire");
    exit;    
}


// Show the page
