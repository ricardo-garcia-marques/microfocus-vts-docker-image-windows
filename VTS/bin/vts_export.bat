@echo off

set CDIR=%~dp0
set NODE="%CDIR%\..\web\node.exe"
set JS_SCRIPT="%CDIR%\..\web\db_io.js"
set connection=""
set table=""
set inst_cmd=
set drop_cmd=

:L_parse
IF "%~1"=="" GOTO L_endparse
IF /I "%~1"=="-connection" (
	set connection="%~2"
	SHIFT
) ELSE IF /I "%~1"=="-table" (
	set table="%~2"
	SHIFT
) ELSE IF /I "%~1"=="-inst" (
	set inst_cmd=-inst "%~2"
	SHIFT
) ELSE IF /I "%~1"=="-drop_table" (
	set drop_cmd=-drop_table
) ELSE (
	echo "unknow parameter:" "%~1"
	GOTO L_error	
)

SHIFT
GOTO L_parse
:L_endparse

IF not [%connection%]==[""] IF not [%table%]==[""] (
	echo "stop VTSService..."
	sc stop VTSService
	
REM	echo %NODE% %JS_SCRIPT% -export -connection %connection% -table %table% %inst_cmd% %drop_cmd%
	%NODE% %JS_SCRIPT% -export -connection %connection% -table %table% %inst_cmd% %drop_cmd%

	sleep 3
	echo "start VTSService..."
	sc start VTSService

	GOTO L_end
)

:L_error
echo usage: vts_export -connection "connection_string" -table "table_name" [-inst "vts_instance_name"] [-drop_table]

:L_end