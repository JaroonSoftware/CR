<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;

$StrSql_CheckDup = "SELECT prod_code FROM product WHERE prod_code = '" . $_POST["Addprod_code"] . "'";
$check = $conn->prepare($StrSql_CheckDup);
$check->execute();

$existing = $check->fetch(PDO::FETCH_ASSOC);
if ($existing) {
    //http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'Data duplicate!'));
} else {
    $strSQL = "INSERT INTO product (`prod_code`, `prod_name`, `prodty_id` , `unit` , `price`, `status`,`c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('" . $_POST["Addprod_code"] . "','" . $_POST["Addprod_name"] . "','" . $_POST["Addprodty_id"] . "','" . $_POST["Addunit"] . "','" . $_POST["Addprice"] . "','Y','" . $action_by . "' ";
    $strSQL .= ")";
    //echo $strSQL;
    $stmt2 = $conn->prepare($strSQL);

    if ($stmt2->execute()) {
        //Check ว่ามี upload file ไหม
        $Prod_Id = $conn->lastInsertId();
        foreach ($_POST['prod_img'] as $index => $object) {
            if ($object['status'] == 'done') {
                $uid = $object['uid'];
                $name = $object['name'];
                $Filename = $object['uid'] . '_' . basename($object['name']);
                $strSQLimg = "INSERT INTO product_img (`uid`, `name`, `file_name` , `prod_id` ) ";
                //  ,`s_date`,`s_time`, s_user) ";
                $strSQLimg .= " VALUES ('" . $uid . "','" . $name . "','" . $Filename . "','" . $Prod_Id . "' ";
                $strSQLimg .= ")";
                $stmt_img = $conn->prepare($strSQLimg);
                $stmt_img->execute();
            }
        }

        $strSQL = "UPDATE product_type SET ";
        $strSQL .= " prodruncode= prodruncode+1 ";
        $strSQL .= "WHERE prodty_id = '" . $_POST["Addprodty_id"] . "' ";

        $stmt3 = $conn->prepare($strSQL);

        if ($stmt3->execute()) {
            http_response_code(200);
            echo json_encode(array('status' => '1', 'message' => $_POST["Addprod_code"]));
        }
    } else {
        echo json_encode(array('status' => '0', 'message' => 'Error insert data!'));
    }
}
