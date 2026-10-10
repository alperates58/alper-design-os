<?php
$pageTitle = "Inventory Management System";
$items = [
    ["id" => "INV-001", "name" => "Industrial Hydraulic Valve", "stock" => 14],
    ["id" => "INV-002", "name" => "Pressure Gauge 0-100 PSI", "stock" => 3]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><?= htmlspecialchars($pageTitle) ?></h1>
    </header>
    <main>
        <table>
            <thead>
                <tr>
                    <th>Part Number</th>
                    <th>Description</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($items as $item): ?>
                <tr>
                    <td><?= htmlspecialchars($item['id']) ?></td>
                    <td><?= htmlspecialchars($item['name']) ?></td>
                    <td><?= (int)$item['stock'] ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
