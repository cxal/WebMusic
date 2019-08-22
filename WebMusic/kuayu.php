<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/4/13
 * Time: 13:49
 */
header('Content-type:text/json;charset=UTF-8');
$Mname = $_POST['musicName'];
$Url = 'http://music.163.com/api/search/get/web?type=1&limit=20&s=';
$searchUrl = $Url.urlencode($Mname);
$information = file_get_contents($searchUrl);
echo $information;

