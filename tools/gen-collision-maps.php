<?php

$MAPS_FILE = __DIR__ . '/../web/data/maps.json';
$MONSTERS_FILE = __DIR__ . '/../web/data/monsters.json';
$WEB_ROOT = __DIR__ . '/../web/';
$ASSETS_FILE = __DIR__ . '/../web/data/assets.json';
$TARGET_FILE = __DIR__ . '/../web/data/collisions.json';
$TMP_DIR = __DIR__ . '/tmp/';
$TILE_SIZE = 300;
$HUD_HEIGHT = 200;
$OFFSET = $HUD_HEIGHT - 50;
$MONSTER_SCALE_FACTOR = 0.3;

if (!is_dir($TMP_DIR)) {
    mkdir($TMP_DIR);
}

$mapDefinitions = json_decode(file_get_contents($MAPS_FILE), true);
$assets = [];
foreach (json_decode(file_get_contents($ASSETS_FILE), true) as $asset) {
    $assets[$asset['id']] = $asset['src'];
}

$collisionMap = [];

foreach ($mapDefinitions as $map => $definition) {
    printf('Converting map "%s" ... ', $map);

    $img = imagecreatetruecolor(count($definition['tiles'][0]) * $TILE_SIZE, count($definition['tiles']) * $TILE_SIZE + $OFFSET);

    $transparent = imagecolorallocatealpha($img, 255, 0, 255, 127);
    imagefill($img, 0, 0, $transparent);
    imagecolortransparent($img, $transparent);

    foreach ($definition['tiles'] as $rowIndex => $row) {
        foreach ($row as $colIndex => $tile) {
            if ($tile === 0) continue;

            $tileImg = imagecreatefromstring(file_get_contents($WEB_ROOT . $assets['tile' . $tile]));
            imagecopy($img, $tileImg, $colIndex * $TILE_SIZE, $OFFSET + $rowIndex * $TILE_SIZE, 0, 0, $TILE_SIZE, $TILE_SIZE);
        }
    }

    imagepng($img, $TMP_DIR . $map . '.png', 9);
    $collisionMap[$map] = getCollisionMap($img);

    echo 'done' . PHP_EOL;
}

$monsterDefinitions = json_decode(file_get_contents($MONSTERS_FILE), true);
foreach ($monsterDefinitions as $monster => $definition) {
    printf('Converting monster "%s" ... ', $monster);

    $img = imagecreatefromstring(file_get_contents($WEB_ROOT . $assets[$monster]));
    $imgResized = imagecreatetruecolor(imagesx($img) * $MONSTER_SCALE_FACTOR, imagesy($img) * $MONSTER_SCALE_FACTOR);
    $transparent = imagecolorallocatealpha($imgResized, 255, 0, 255, 127);
    imagefill($imgResized, 0, 0, $transparent);
    imagecolortransparent($imgResized, $transparent);
    imagecopyresampled($imgResized, $img, 0, 0, 0, 0, imagesx($img) * $MONSTER_SCALE_FACTOR, imagesy($img) * $MONSTER_SCALE_FACTOR, imagesx($img), imagesy($img));

    imagepng($imgResized, $TMP_DIR . $monster . '.png', 9);
    $collisionMap[$monster] = getCollisionMap($imgResized);

    echo 'done' . PHP_EOL;
}

echo 'Writing collision map ... ';
file_put_contents($TARGET_FILE, json_encode($collisionMap));
echo 'done' . PHP_EOL;


function getCollisionMap($img) {
    $collisionMap = [];
    $width = imagesx($img);
    $height = imagesy($img);

    for ($x = 0; $x < $width; $x++) {
        for ($y = 0; $y < $height; $y++) {
            $color = imagecolorat($img, $x, $y);
            $alpha = ($color >> 24) & 0x7f;

            if ($alpha <= 20) {
                if (!isset($collisionMap[$x])) {
                    $collisionMap[$x] = [];
                }
                $collisionMap[$x][$y] = 1;
            }
        }
    }

    return $collisionMap;
};