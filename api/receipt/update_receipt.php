<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

        $strSQL = "UPDATE receipt SET ";
        $strSQL .= " amounts='".$_POST["Edit_amounts"]."'";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE rcpt_no = '".$_POST["rcpt_no"]."' ";
        
        $stmt = $conn->prepare($strSQL);   

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["rcpt_no"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error update data!'));
            }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>