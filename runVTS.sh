#!/bin/sh

# Create database folder 
mkdir "/opt/MF/VTS/db/data"

# Set VTS config
sed -i  -E 's/("adminPort":).*(,)/\1'"$ADMIN_PORT"'\2/g' configure.json
sed -i  -E 's/("defaultApiPort":).*(,)/\1'"$DEFAULT_API_PORT"'\2/g' configure.json
sed -i  -E 's/("enableDiag":).*(,)/\1'"$ENABLE_DIAG"'\2/g' configure.json
sed -i  -E 's/("autoCreateIndexedColumn":).*(,)/\1'"$AUTO_CREATE_INDEXED_COLUMN"'\2/g' configure.json
sed -i  -E 's/("defaultLanguage":.*").*(".*,)/\1'"$DEFAULT_LANGUAGE"'\2/g' configure.json
sed -i  -E 's/("tlsVersion":.*").*(".*,)/\1'"$TLS_VERSION"'\2/g' configure.json
sed -i  -E 's/("level":.*").*(".*,)/\1'"$LOGGER_LEVEL"'\2/g' configure.json
sed -i  -E 's/("useSSL":).*(,)/\1'"$USE_SSL"'\2/g' configure.json

# Print VTS config
echo 'VTS config'
cat configure.json

# Run VTS
echo 'VTS initialized'
./node main.js