#!/bin/bash

# Function to run the ghcid command and check for errors
run_ghcid() {
    ghcid --target=constitution-checker-backend-exe --run --restart=./src --restart=./web
}

# Loop to keep running ghcid until it succeeds
seconds=6
while true; do
    run_ghcid

    # Check the exit status of the ghcid command
    if [ $? -eq 0 ]; then
        echo "ghcid ran successfully. Exiting loop."
        break
    else
        echo "ghcid encountered an error. Restarting in $seconds seconds."
        sleep $seconds
    fi
done
