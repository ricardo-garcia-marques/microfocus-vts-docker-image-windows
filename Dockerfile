FROM mcr.microsoft.com/windows/servercore:ltsc2016

ADD VTS C:/VTS

WORKDIR C:/VTS/web

COPY runVTS.ps1 .

ENV ADMIN_PORT=4000 \
    DEFAULT_API_PORT=8888 \
    ENABLE_DIAG=true \
    MAX_INSTANCES_ALLOWED=50 \
    AUTO_CREATE_INDEXED_COLUMN=true \
    USE_SSL=true \
    TLS_MIN_VERSION=TLSv1.2 \
    TLS_MAX_VERSION=TLSv1.3 \
    CIPHERS=ALL \
    DEFAULT_LANGUAGE=en \
    LOGGER_LEVEL=error 

CMD [ "powershell",".\\runVTS.ps1" ]