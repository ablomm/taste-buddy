#!/bin/bash

# Wait for Elasticsearch to start
until curl -s http://localhost:9200; do
  echo 'Waiting for Elasticsearch to start...'
  sleep 1
done

echo 'Elasticsearch has successfully started...'

# Check if recipes index exists
if curl -s "http://localhost:9200/_cat/indices" | grep -q 'recipes'; then
  echo 'Recipes index already exists...'
else
  # Create recipes index
  curl -X PUT "http://localhost:9200/recipes"
  echo 'Created recipes index...'
fi

# Check if posts index exists
if curl -s "http://localhost:9200/_cat/indices" | grep -q 'posts'; then
  echo 'Posts index already exists...'
else
  # Create posts index
  curl -X PUT "http://localhost:9200/posts"
  echo 'Created posts index...'
fi

