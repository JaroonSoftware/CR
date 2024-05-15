<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    // $StrSql_CheckDup = mysqli_query($conn,"SELECT prod_code FROM product WHERE prod_code = '".$_POST["Editprod_code"]."'  and prod_id != '".$_POST["Editprod_id"]."' ");
    // $check = mysqli_num_rows($StrSql_CheckDup);
    // if ($check == 0) {
        $strSQL = "UPDATE product SET ";
        $strSQL .= " prod_name='".$_POST["Editprod_name"]."',prodty_id='".$_POST["Editprodty_id"]."',price='".$_POST["Editprice"]."',unit='".$_POST["Editunit"]."',status='".$_POST["Editstatus"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE prod_id = '".$_POST["Editprod_id"]."' ";
        
        $stmt = $conn->prepare($strSQL);   

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editprod_code"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
            }

    // }else{
    //     echo json_encode(array('status' => '0','message'=> 'หมวดหมู่ '.$_POST["Editcategoryname"].' มีในระบบแล้ว!'));
    // }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>