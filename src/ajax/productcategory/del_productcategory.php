<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

        $strSQL = "DELETE FROM `product_category` WHERE id = '".$_POST["id"]."' ";
        $query = mysqli_query($conn,$strSQL);    

            if($query) {
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