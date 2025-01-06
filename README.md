# CarRental
## Docker Compose Setup

This project uses Docker Compose to manage the development environment. The setup includes three services: `db`, `backend`, and `frontend`.

### Services

#### Database (`db`)

- **Image**: `mysql:8.0`
- **Ports**: `3306:3306`
- **Container Name**: `car_rental_db`
- **Environment Variables**:
    - `MYSQL_ROOT_PASSWORD`
    - `MYSQL_DATABASE`
    - `MYSQL_CHARSET`: `utf8mb4`
    - `MYSQL_COLLATION`: `utf8mb4_unicode_ci`
- **Volumes**:
    - `./my.cnf:/etc/mysql/conf.d/my.cnf`
    - `./mysql:/var/lib/mysql`
    - `./scripts:/docker-entrypoint-initdb.d:ro`

#### Backend (`backend`)

- **Build Context**: `./apps/car-rental-backend`
- **Dockerfile**: `./apps/car-rental-backend/Dockerfile`
- **Command**: `npm run serve:car-rental-backend`
- **Container Name**: `car_rental_backend`
- **Expose**: `3000`
- **Ports**: `3000:3000`
- **Depends On**: `db`
- **Environment Variables**:
    - `DATABASE_HOST`: `db`
    - `DATABASE_PORT`: `3306`
    - `DATABASE_USER`
    - `DATABASE_PASSWORD`
    - `DATABASE_NAME`
- **Volumes**:
    - `.:/app`
    - `/app/node_modules`

#### Frontend (`frontend`)

- **Build Context**: `./apps/car-rental`
- **Dockerfile**: `./apps/car-rental/Dockerfile`
- **Command**: `npm run serve:car-rental -- --host 0.0.0.0`
- **Container Name**: `car_rental_frontend`
- **Ports**: `4200:4200`
- **Depends On**: `backend`
- **Volumes**:
    - `.:/app`
    - `/app/node_modules`

### Networks

- **Default Network**: `car_rental_network`
    - **Driver**: `bridge`

### Usage

To start the services, run:

```sh
docker-compose up
```

To stop the services, run:

```sh
docker-compose down
```

For more information on Docker Compose, refer to the [official documentation](https://docs.docker.com/compose/).
