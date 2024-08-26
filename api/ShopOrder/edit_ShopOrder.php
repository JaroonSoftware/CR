<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

        $strSQL = "UPDATE so SET ";
        $strSQL .= "cus_name='".$_POST["Editcus_name"]."',address='".$_POST["Editaddress"]."',subdistrict='".$_POST["Editsubdistrict"]."' ";
        $strSQL .= ",district='".$_POST["Editdistrict"]."',province='".$_POST["Editprovince"]."',zipcode='".$_POST["Editzipcode"]."' ";
        $strSQL .= ",tel='".$_POST["Edittel"]."',embroider_prefix='".$_POST["Editembroider_prefix"]."',embroider_name='".$_POST["Editembroider_name"]."',embroider_surname='".$_POST["Editembroider_surname"]."' ,e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."',delivery_channel='".$_POST["Editdelivery_channel"]."' ";
        $strSQL .= "WHERE so_no = '".$_POST["Editso_no"]."' ";
        $stmt = $conn->prepare($strSQL);
        if ($stmt->execute()) {  
            echo json_encode(array('status' => '1','message'=> $_POST["Editso_no"]));
        } else {
            echo json_encode(array('status' => '0', 'message' => 'Error Update SO!'));
        }  

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		
?>