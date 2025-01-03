USE car_rental;
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT NOT NULL,
    brand INT NOT NULL,
    vehicleIdentificationNumber VARCHAR(255) NOT NULL,
    registrationNumber VARCHAR(255) NOT NULL,
    clientEmail VARCHAR(255),
    clientAddress VARCHAR(255),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_brand FOREIGN KEY (brand) REFERENCES vehicle_brands(id),
    UNIQUE (vehicleIdentificationNumber),
    UNIQUE (registrationNumber)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4;