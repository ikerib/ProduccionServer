#!/bin/sh
OPTIONS=`vagrant ssh-config | awk -v ORS=' ' '{print "-o " $1 "=" $2}'`

scp ${OPTIONS} -r _doc/planificacion vagrant@10.10.10.10:/tmp
