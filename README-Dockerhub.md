# Micro Focus VTS

This is an unofficial Docker image for [Micro Focus Virtual Table Server](https://marketplace.microfocus.com/appdelivery/content/virtual-table-server)

## Getting Started

The Docker image was built with Windows Server 2019

For a compatibility matrix of operating systems supported for running Docker containers, see https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility

### Prerequisities

In order to run this container you'll need docker installed

* [Windows](https://docs.docker.com/windows/started)

### Usage


To run VTS with default configuration, use the following command

You can acces VTS in https://localhost:4000. Ports from 4001 to 4050 will be used to create new instances.


    docker run -p 8888:8888 -p 4000-4050:4000-4050 --name=VTS -d -t ricardogarciamarques/microfocus_vts:2020.0.0

Run VTS in http mode and increase the maximun number of instances to 100. Range port exposed must be increase to access new instances


    docker run -p 8888:8888 -p 4000-4050:4000-4050 --name=VTS -d -t ricardogarciamarques/microfocus_vts:2020.0.0

**Note: This repo does not publish or maintain a latest tag. Please declare a specific tag when pulling or referencing images from this repo.**


### Environment Variables

* `ADMIN_PORT` - This port is used by the VTS UI to read and modify data in the VTS table, the default value is 4000 
* `DEFAULT_API_PORT` - The default port that Vuser scripts use to access the VTS table using API functions, the default value is 8888 
* `ENABLE_DIAG` - Enables the VTS diagnosis feature. If set to true, you can access the following URL to view logs, apis, and meta data: *http://vts_server_name:admin_port/data/diag* . The default value is false
* `MAX_INSTANCES_ALLOWED` - VTS supports multiple instances. Use this setting to configure the maximum number of instances that VTS should support, the default value is 50
* `AUTO_CREATE_INDEXED_COLUMN` - When set to true, each column is automatically indexed, the default value is true
* `USE_SSL` - Specifies whether or not HTTPS should be used to access the VTS table from the VTS user interface, the default value is true
* `TLS_VERSION` - Possible values: auto, tls1.0, tls1.1, tls1.2. The default value is auto
* `DEFAULT_LANGUAGE` - Sets the VTS server language, the default value is en 
* `LOGGER_LEVEL` - Specifies the level of logging, the default value is error 

## Repository

* [GitHub](https://github.com/ricardo-garcia-marques/microfocus-vts-docker-image)