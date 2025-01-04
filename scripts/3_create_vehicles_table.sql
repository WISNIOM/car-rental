SET NAMES utf8mb4;

USE car_rental;

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT NOT NULL,
    brandId INT NOT NULL,
    vehicleIdentificationNumber VARCHAR(255) NOT NULL,
    registrationNumber VARCHAR(255) NOT NULL,
    clientEmail VARCHAR(255),
    clientAddressId INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_brand FOREIGN KEY (brandId) REFERENCES vehicle_brands(id),
    CONSTRAINT fk_clientAddress FOREIGN KEY (clientAddressId) REFERENCES addresses(id),
    UNIQUE (vehicleIdentificationNumber),
    UNIQUE (registrationNumber)
);

ALTER TABLE vehicles
CONVERT TO CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;