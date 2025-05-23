#!/bin/bash

set -e  # exit on error
ACTION=$1
INVENTORY="inventory.ini"
EXTRA_VARS="VMID_instance=101"

case "$ACTION" in
  up)
    ansible-playbook -i $INVENTORY site.yml --extra-vars "$EXTRA_VARS"
    ;;
  down)
    ansible-playbook -i $INVENTORY teardown.yml --extra-vars "$EXTRA_VARS"
    ;;
  *)
    echo "Usage: $0 {up|down}"
    exit 1
    ;;
esac