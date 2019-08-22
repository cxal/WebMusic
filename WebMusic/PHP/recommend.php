<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/4/28
 * Time: 15:06
 */
header('Content-type:text/json;charset=UTF-8');
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = 'SELECT * FROM recommend';
$result = $conn->query($sql);
$data = mysqli_fetch_all($result,MYSQLI_ASSOC);
  // 输出数据
echo json_encode($data,320);
$conn->close();