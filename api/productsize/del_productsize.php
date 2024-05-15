<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

        $strSQL = "UPDATE product_size SET ";
        $strSQL .= " status='Del'";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE id = '".$_POST["id"]."' ";
        
        $stmt = $conn->prepare($strSQL);   

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> ''));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error Delete data!'));
            }

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>