# Micro Focus VTS

This is an unofficial Docker image for [Micro Focus Virtual Table Server](https://marketplace.microfocus.com/appdelivery/content/virtual-table-server)

## Getting Started

The Docker image was built with Windows Server 2019

For a compatibility matrix of operating systems supported for running Docker containers, see https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility

### Prerequisities

In order to run this container you'll need docker installed

* [Windows](https://docs.docker.com/windows/started)

### Usage

**Note: This repo does not publish or maintain a latest tag. Please declare a specific tag when pulling or referencing images from this repo.**

To run VTS with default configuration, use the following command

You can acces VTS in https://localhost:4000.

    docker run -d -t -p 8888:8888 -p 4000:4000 --name=microfocus_vts ricardogarciamarques/microfocus_vts_windows:2020.1.0

Run VTS in http mode, increase the maximun number of instances to 100 and enable diagnosis feature (http://localhost:4000/data/diag) over http

    docker run -d -t -p 8888:8888 -p 4000:4000  -e USE_SSL=false -e MAX_INSTANCES_ALLOWED=100 -e ENABLE_DIAG=true --name=microfocus_vts ricardogarciamarques/microfocus_vts_windows:2020.1.0

Version 2020.0.0 and earlier you must publish the ports for the new instances. In the next example, ports from 4001 to 4050 will be used to create new instances.

    docker run -d -t -p 8888:8888 -p 4000-4050:4000-4050 --name=microfocus_vts ricardogarciamarques/microfocus_vts_windows:2020.0.0

Set TLS version to 1.3

    docker run -d -t -p 8888:8888 -p 4000:4000  -e TLS_MIN_VERSION=TLSv1.3 -e TLS_MAX_VERSION=TLSv1.3 -e CIPHERS=TLS_AES_256_GCM_SHA384 --name=microfocus_vts  ricardogarciamarques/microfocus_vts_windows:2020.3.0

### Environment Variables

These enviroment variables modify VTS configuration. For more information see '[Configure VTS Help](https://admhelp.microfocus.com/vugen/en/2020_SP2-SP3/help/WebHelp/Content/VTS/c_configure_SPS.htm?tocpath=Virtual%20Table%20Server%20(VTS)%7CVirtual%20Table%20Server%20(VTS)%7CManage%20VTS%7C_____4)'

* `ADMIN_PORT` - This port is used by the VTS UI to read and modify data in the VTS table, the default value is 4000 
* `DEFAULT_API_PORT` - The default port that Vuser scripts use to access the VTS table using API functions, the default value is 8888 
* `ENABLE_DIAG` - Enables the VTS diagnosis feature. If set to true, you can access the following URL to view logs, apis, and meta data: *http://vts_server_name:admin_port/data/diag* . The default value is false
* `MAX_INSTANCES_ALLOWED` - VTS supports multiple instances. Use this setting to configure the maximum number of instances that VTS should support, the default value is 50
* `AUTO_CREATE_INDEXED_COLUMN` - When set to true, each column is automatically indexed, the default value is true
* `USE_SSL` - Specifies whether or not HTTPS should be used to access the VTS table from the VTS user interface, the default value is true
* `TLS_MIN_VERSION` - (Since 2020.3.0) Possible values: TLSv1, TLSv1.1, TLSv1.2, TLSv1.3. The default value is TLSv1.2
* `TLS_MAX_VERSION` - (Since 2020.3.0)Possible values: TLSv1, TLSv1.1, TLSv1.2, TLSv1.3. The default value is TLSv1.3
* `CIPHERS` - (Since 2020.3.0) Specifies which ciphers are supported over SSL. The default value is ALL. Note: The TLSv1.3 cipher suites can only be enabled by including their full name in the cipher list, e.g. , TLS_AES_256_GCM_SHA384
* `DEFAULT_LANGUAGE` - Sets the VTS server language, the default value is en 
* `LOGGER_LEVEL` - Specifies the level of logging, the default value is error 

#### Vesions 2020.2.0 and erlier
* `TLS_VERSION` - (instead `TLS_MAX_VERSION/TLS_MIN_VERSION`) Possible values: auto, tls1.0, tls1.1, tls1.2. The default value is auto
## Repository

* [GitHub](https://github.com/ricardo-garcia-marques/microfocus-vts-docker-image-windows)