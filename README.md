# Car Rental

This project is a vehicle rental application that allows users to add, edit, remove, and view vehicles. It also allows users to add client email and client address information if the vehicle is rented to someone. The application is built using Angular for the frontend, NestJS for the backend, and MySQL for the database. The development environment is managed using Docker Compose.


## Docker Compose Setup

This project uses Docker Compose to manage the development environment. The setup includes three services: `db`, `backend`, and `frontend`.

### Services

#### Database (`db`)

##### Description

The database service uses MySQL to store all the data related to the car rental application. When you run the `db` service for the first time, it will execute all SQL scripts located in the `scripts` directory to set up the database schema and seed initial data. The scripts currently included are:
- `0_create_database.sql`
- `1_create_vehicle_brands_table.sql`
- `2_create_addresses_table.sql`
- `3_create_vehicles_table.sql`
- `4_seed_data.sql`

##### Docker compose structure

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

##### Description

The backend service is a Node.js application built with NestJS. It provides the API endpoints for the frontend to interact with the database. The backend service depends on the `db` service to be running.

##### Docker compose structure

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

##### Description

The frontend service is an Angular application that provides the user interface for the car rental application. It depends on the `backend` service to be running to fetch and display data.

##### Docker compose structure

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

### Running Locally

To run the application locally, you need to uncomment the lines in `app.module.ts` that configure the database connection for local development:

```ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from '../resources/vehicles/vehicles.module';
import { Vehicle } from '../resources/vehicles/entities/vehicle.entity';
import { VehicleBrand } from '../resources/vehicle-brands/entities/vehicle-brand.entity';
import { Address } from '../resources/addresses/entities/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // Use it when you run the app in Docker
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        // Use it when you run the app locally
        // host: 'localhost',
        // port: 3306,
        // username: 'root',
        // password: 'root',
        // database: 'car_rental',
        entities: [Vehicle, VehicleBrand, Address],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    VehiclesModule,
  ],
})
export class AppModule {}
```

To run the frontend locally, use the following command:
```sh
npx nx run car-rental:serve
```

To run the backend locally, use the following command:
```sh
npx nx run car-rental-backend:serve
```
Before you run backend service, do not forget to run db service.

### Running Tests

To run tests for all projects, use the following command:
```sh
npx nx run-many --targets=test
```

### VS Code Run Settings
The project includes ```./vscode``` run settings to facilitate running the application locally. Make sure to check the ```.vscode``` folder for predefined configurations.