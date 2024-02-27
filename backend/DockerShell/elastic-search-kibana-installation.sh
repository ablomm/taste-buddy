docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.12.2
docker pull docker.elastic.co/kibana/kibana:8.12.2
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
