<?php
// Path to the text file that stores the count
$file = 'counter.txt';

if (!file_exists($file)) {
  file_put_contents($file, 0);
}

// Read the current count
$count = (int)file_get_contents($file);

// Increment the count
$count++;

// Save the new count
file_put_contents($file, $count);

// Output the count (you could also just echo it)
echo $count;
?>
