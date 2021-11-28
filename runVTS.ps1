# Create database folder 
mkdir "C:/VTS/db/data"

# Set replacement strings 
$replace_admin_port = '"adminPort": ' + $ENV:ADMIN_PORT + ','
$replace_default_api_port = '"defaultApiPort": ' + $ENV:DEFAULT_API_PORT + ','
$replace_enable_diag = '"enableDiag": ' + $ENV:ENABLE_DIAG + ','
$repalace_max_instances_allowed = '"maxInstancesAllowed": ' + $ENV:MAX_INSTANCES_ALLOWED + ','
$replace_auto_create_indexed_column = '"autoCreateIndexedColumn": ' + $ENV:AUTO_CREATE_INDEXED_COLUMN + ','
$replace_use_ssl = '"useSSL": ' + $ENV:USE_SSL + ','
$replace_default_language = '"defaultLanguage": "' + $ENV:DEFAULT_LANGUAGE + '",'
$replace_tls_version = '"tlsVersion": "' + $ENV:TLS_VERSION + '",'
$replace_logger_level = '"level": "' + $ENV:LOGGER_LEVEL + '",'

# Set VTS config
(Get-Content configure.json).
Replace('"adminPort": 4000,', $replace_admin_port).
Replace('"defaultApiPort": 8888,', $replace_default_api_port).
Replace('"enableDiag": false,', $replace_enable_diag).
Replace('"autoCreateIndexedColumn": true,', $replace_auto_create_indexed_column).
Replace('"defaultLanguage": "en",', $replace_default_language).
Replace('"tlsVersion": "auto",', $replace_tls_version).
Replace('"maxInstancesAllowed": 50,', $repalace_max_instances_allowed).
Replace('"level": "error",', $replace_logger_level).
Replace('"useSSL": false,', $replace_use_ssl ) |
Set-Content configure.json

Write-Output 'VTS config'
Get-Content configure.json

Write-Output 'VTS initialized'
#Run VTS
C:\VTS\web\node.exe main.js