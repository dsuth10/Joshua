$json = Get-Content 'ac_v9_complete.json' -Raw | ConvertFrom-Json
$descriptors = $json.example.curriculum.learning_areas | 
Where-Object { $_.id -eq 'the_arts' } | 
ForEach-Object { $_.strands } | 
Where-Object { $_.id -eq 'music' } | 
ForEach-Object { $_.content_descriptors } | 
Where-Object { $_.year_level -eq '5-6' -or $_.year_level -eq '5' } | 
Select-Object code, year_level, text

# Output as JSON without truncation
$descriptors | ForEach-Object {
    [PSCustomObject]@{
        code       = $_.code
        year_level = $_.year_level
        text       = $_.text
    }
} | ConvertTo-Json
