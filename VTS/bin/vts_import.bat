@echo off

set CDIR=%~dp0
set NODE="%CDIR%\..\web\node.exe"
set JS_SCRIPT="%CDIR%\..\web\db_io.js"
set connection=""
set query=""
set inst=""

:L_parse
IF "%~1"=="" GOTO L_endparse
IF /I "%~1"=="-connection" (
	set connection="%~2"
	SHIFT
) ELSE IF /I "%~1"=="-query" (
	set query="%~2"
	SHIFT
) ELSE IF /I "%~1"=="-inst" (
	set inst="%~2"
	SHIFT
) ELSE (
	echo "unknow parameter:" "%~1"
	GOTO L_error	
)

SHIFT
GOTO L_parse
:L_endparse

IF not [%connection%]==[""] IF not [%query%]==[""] (
	echo "stop VTSService..."
	sc stop VTSService

	if [%inst%]==[""] (
		%NODE% %JS_SCRIPT% -import -connection %connection% -query %query%
	) ELSE (
		%NODE% %JS_SCRIPT% -import -connection %connection% -query %query% -inst %inst%
	)

	sleep 3
	echo "start VTSService..."
	sc start VTSService

	GOTO L_end
)

:L_error
echo usage: vts_import -connection "connection_string" -query "sql_query_string" [-inst "vts_instance_name"]

:L_end