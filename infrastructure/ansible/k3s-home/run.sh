#!/bin/bash

set -e  # exit on error
ACTION=$1
INVENTORY="inventory.ini"
EXTRA_VARS="VMID_instance=101"

ansible-galaxy collection install community.kubernetes

case "$ACTION" in
  up)
    ansible-playbook -i $INVENTORY site.yaml --extra-vars "$EXTRA_VARS"
    ;;
  down)
    ansible-playbook -i $INVENTORY teardown.yaml --extra-vars "$EXTRA_VARS"
    ;;
  *)
    echo "Usage: $0 {up|down}"
    exit 1
    ;;
esac