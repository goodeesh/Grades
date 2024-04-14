#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion (optional)

# Open OrbStack app
open -a OrbStack

# Wait for OrbStack to open
sleep 5

docker start grades
nvm use 20
yarn rw dev



# Execute AppleScript to hide OrbStack app
osascript <<EOF
tell application "OrbStack"
    activate
    delay 1
    tell application "System Events" to set visible of process "OrbStack" to false
end tell
EOF
