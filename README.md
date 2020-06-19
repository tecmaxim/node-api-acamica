## Challenge Node-Api Acamica
### V 1.0.0

## How to start
### Clone repository
```bash
git clone https://{user}@bitbucket.org/tecmaxim/api-acamica.git
```
### Install dependencies, copy env file set the main settings and run the main script
```bash
cd api-acamica/
npm i
# You must config variables as you need. example your db host:user:pw
cp .env.example .env
node app.js
```

## What is this?
Students CRUD Mysql/NodeJS (see .env files to setting host). To store information about students and their payments options.-

## Help for PM2 - RECOMENDED!
If you have a graet server-monitorin balanced use this api whit PM2.
Set the main settings on .env and run the command with the following sintax:
pm2 start app.js --name "api-acamica"

# Run with Docker

1) Install Docker.

2) Create .env file using .env.example info (Modify envs vars as much as you need).

3) In project root execute ```~$ docker build -t [docker-repository-name] .```.

4) Then run the docker ```~$ sudo docker run --publish [port]:[port] --name [docker-image-name]  -v [absolute root to the proyect]:/api-acamica -d [docker-repository-name]```.

5) Try to get into the bash with ```~$ docker exec -it [docker-image-name] bash```.

## ENDPOINTS

### POST
http://<your_host>/api/v1/student
```
{
    "student": {
        "name":"Jhon Doe",
        "email": "mail@gmail.com",
        "career": "Comunications",
        "birthday": "1988-10-10",
        "phone": 123456789,
        "country": "Arg",
        "city": "Buenos Aires"
    },
    "paymentMethod": {
        "idPayment": 2,
        "installments": 3
    }
}
```

### PUT
http://<your_host>/api/v1/student/<id_student>
```
{    
    "student": {
        "name":"Jhon Doe",
        "email": "mail@gmail.com",
        "career": "Comunications",
        "birthday": "1988-10-10",
        "phone": 123456789,
        "country": "Arg",
        "city": "Buenos Aires"
    },
    "paymentMethod": {
        "idPayment":2,
        "installments" 2
    }
}
```

### GET ONE
http://<localhost>/api/v1/student/4

### GET ALL
http://localhost:7990/api/v1/student

### GET WITH SEARCH AND PAGINATION
http://localhost:7990/api/v1/student?name=Maxi&country=Arg&offset=3

### DELETE
http://localhost:7990/api/v1/student/<id_student>

### GET PAYMEMT AVAILABLES
http://localhost:7990/api/v1/payment
