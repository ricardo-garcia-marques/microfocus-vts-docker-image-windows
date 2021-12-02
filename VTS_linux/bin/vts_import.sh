#!/bin/sh

CDIR=`dirname $0`
NODE="$CDIR/../web/node"
JS_SCRIPT="$CDIR/../web/db_io.js"
connection=""
query=""
inst=""

main_parse()
{
    if [$1=""]; then
        end_parse
    fi
    if [$1="-connection"]; then
        connection=$2
        shift
    elif [$1="-query"]; then
        query=$2
        shift
    elif [$1="-inst"]; then
        inst=$2
        shift
    else
        echo "unknown parameter: $1"
        end_error
    fi
}

end_parse()
{
    if [$connection!=""] &&[$query!=""]; then
        echo "stop vts service"
        service vts stop
    
        if [$inst=""]; then
            $NODE $JS_SCRIPT -import -connection $connection -query $query
        else
            $NODE $JS_SCRIPT -import -connection $connection -query $query -inst $inst
        fi
        sleep 3
        echo "start vts service"
        service vts start
    fi
}

end_error()
{
   echo "usage: vts_import -connection "connection_string" -query "sql_query_string" [-inst "vts_instance_name"]"		
}

main_parse



