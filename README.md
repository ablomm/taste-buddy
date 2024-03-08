# Backend 
- `npm install`
- `npx prisma migrate dev` to update db
- `npm run start:dev`

# Frontend
- `npm install`
- add .env file that contains backend url EXPO_PUBLIC_SERVER_URL = "http://[ipAddress]:[backend port number]"
- `npm start`

# Docker
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. If you are using windows, after installing, you need to increase the wsl2 memory limit to increase performance, if you have 16gb of ram, do the following:
```
cd %UserProfile%
notepad .wslconfig
```

add the following and save:

```
[wsl2]
memory=12GB
```

3. Restart your computer.

4. Run:
```
docker-compose up --build
``` 
from the taste-buddy directory.
All the containers should be built and started, and the app should now be accessible.

# Dev Containers
1. Install the dev containers vscode extension
2. click the bottom left and then "re-open in container"
![alt text](readme_images/image.png)
![alt text](readme_images/image-1.png)

# Elasticsearch setup through Docker
run:
```
docker-compose up elasticsearch
```

# Kibana
run:
```
docker-compose up kibana
```
Go to http://localhost:5601