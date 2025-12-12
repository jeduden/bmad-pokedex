#!/bin/bash

# Read JSON from stdin
input=$(cat)

# Extract prompt from JSON
prompt=$(echo "$input" | jq -r '.prompt // ""')
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Log to PROMPTS.md in project root
log_file="PROMPTS.md"

# Create header if file doesn't exist
if [ ! -f "$log_file" ]; then
    echo "# Prompt Log" > "$log_file"
    echo "" >> "$log_file"
fi

# Append prompt entry
echo "## $timestamp" >> "$log_file"
echo "" >> "$log_file"
echo "$prompt" >> "$log_file"
echo "" >> "$log_file"
echo "---" >> "$log_file"
echo "" >> "$log_file"

exit 0
