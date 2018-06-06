#!/bin/bash

set -e

source .circleci/get_opts.sh

mkdir -p pack
zip -r pack/$PACKAGE_FILE.zip build
