#!/bin/bash
ionice -c3 nice -n 19 js sct-2.js | tee -a sct3.log
