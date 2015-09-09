#! /bin/bash
#

pushd .

dev/builder/build.sh --leave-css-unminified --leave-js-unminified 

popd

