#!/bin/bash

set -e  # exit on error
ACTION=$1
INVENTORY="inventory.ini"

case "$ACTION" in
  up)
    ansible-playbook -vvv -i $INVENTORY site.yaml
    ;;
  down)
    ansible-playbook -i $INVENTORY down.yaml
    ;;
  teardown)
    ansible-playbook -i $INVENTORY teardown.yaml
    ;;
  *)
    echo "Usage: $0 {up|down|teardown}"
    exit 1
    ;;
esac