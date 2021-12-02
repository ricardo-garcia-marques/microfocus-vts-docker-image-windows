#!/bin/sh

CDIR=`dirname $0`
NODE="$CDIR/../web/node"
JS_SCRIPT="$CDIR/../web/db_io.js"
connection=""
table=""
inst_cmd=""
drop_cmd=""

main_parse()
{
    if [$1=""]; then
        end_parse
    fi
    if [$1="-connection"]; then
        connection=$2
        shift
    elif [$1="-table"]; then
        table=$2
        shift
    elif [$1="-inst"]; then
        inst_cmd="-inst $2"
        shift
    elif [$1="-drop_table"]; then
        drop_cmd="-drop_table"
    else
        echo "unknown parameter: $1"
        end_error
    fi
}

end_parse()
{
    if [$connection!=""] &&[$table!=""]; then
        echo "stop vts service"
        service vts stop

        sleep 3
        echo "start vts service"
        service vts start
    fi
}

end_error()
{
   echo "usage: vts_export -connection "connection_string" -table "table_name" [-inst "vts_instance_name"] [-drop_table]"		
}

main_parse



