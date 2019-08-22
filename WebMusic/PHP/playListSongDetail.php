<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/4
 * Time: 16:51
 */
header('Content-type:text/json;charset=UTF-8');
$songId = $_POST['songId'];
$data = array();
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
for ($i = 0; $i < sizeof($songId); $i++) {
  $sql = "SELECT * FROM playlistmusic WHERE songId ='{$songId[$i]}'";
  $result = $conn->query($sql);
  if(! $result) {
    die('无法读取数据: ' . mysqli_error($conn));
  }
  while($row = mysqli_fetch_all($result)) {
    array_push($data,$row);
  }
}
echo json_encode($data,320);
$conn->close();