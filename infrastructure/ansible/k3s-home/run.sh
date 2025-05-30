#!/bin/bash

set -e  # exit on error
ACTION=$1
INVENTORY="inventory.ini"
EXTRA_VARS="VMID_instance=101"

ansible-galaxy collection install kubernetes.core

case "$ACTION" in
  up)
    ansible-playbook -vvv -i $INVENTORY site.yaml --extra-vars "$EXTRA_VARS"
    ;;
  down)
    ansible-playbook -i $INVENTORY teardown.yaml --extra-vars "$EXTRA_VARS"
    ;;
  teardown)
    ansible-playbook -i $INVENTORY teardown.yaml --extra-vars "$EXTRA_VARS"
    ;;
  *)
    echo "Usage: $0 {up|down|teardown}"
    exit 1
    ;;
esac