# Backend 
- `npm install`
- `npx prisma migrate dev` to update db
- `npm start`

# Frontend
- `npm install`
- add .env file that contains backend url EXPO_PUBLIC_SERVER_URL = "http://[ipAddress]:[backend port number]"
- `npm start`

# Elasticsearch setup through Docker
Installation Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html  

Ensure Docker is installed by typing `docker` into your CLI. If you are getting an error then install Docker as instructed on the website https://docs.docker.com/engine/install/

### Step 1: Execute the following in your terminal to pull the images and run the containers.  
`docker network create elastic`  
`docker pull docker.elastic.co/elasticsearch/elasticsearch:8.12.2`  
`docker pull docker.elastic.co/kibana/kibana:8.12.2`  

### Step 2: 
In one terminal, run the following:
`docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.2`

### Step 3: 
You will need the username and password which will be generated in the logs. Once found, enter them in the backend's `.env` file where marked with a placeholder.

### Step 4: 
In a new terminal, run the following command. It will generate the certificate required for connection.  
`docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .`  

### Step 5: 
After running, the certificate should be generated in the current directory. Paste the file path to that certificate in the backend's `.env` file where marked with a placeholder.  
Example directory path for a Mac user: `"/Users/herb/http_ca.crt"`  

### Step 6: 
Once complete, you have successfully setup Elasticsearch with Docker and configured the backend. Check your Docker Desktop to confirm.   

### Step 7: 
Finally, run the container for Kibana. You should have one CLI instance for Elasticsearch running and one for Kibana if done correctly.   
`docker run --name kib01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.12.2`  

### All done! An Elasticsearch and Kibana container should be running. You can also manually start/stop them in the Docker Desktop application.

# Using Kibana
The container was set to run on port 5601 so navigate to `http://localhost:5601/`

You will be prompted to enter an enrollment token, this is found in the logs of the Elasticsearch container. The same log containing your username and password. 
Once entered, you can login using the provided username and password as mentioned. 

From here, you have two options to create and view data. Either create new recipes and posts in the TasteBuddy app or follow this guide https://www.elastic.co/guide/en/starting-with-the-elasticsearch-platform-and-its-solutions/current/getting-started-general-purpose.html#gp-gs-add-data from step 3. This guide is useful even after creating data with the first option, where you will learn to create a data view in Kibana to view stored data.
