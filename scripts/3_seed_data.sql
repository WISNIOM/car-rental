USE car_rental;

INSERT INTO
    vehicle_brands (name)
VALUES
    ('Volkswagen'),
    ('Audi'),
    ('Porsche'),
    ('Skoda'),
    ('Fiat'),
    ('BMW'),
    ('Mercedes-Benz'),
    ('Toyota'),
    ('Honda'),
    ('Ford'),
    ('Chevrolet'),
    ('Nissan'),
    ('Hyundai'),
    ('Kia'),
    ('Mazda'),
    ('Subaru'),
    ('Jaguar'),
    ('Land Rover'),
    ('Volvo'),
    ('Mini'),
    ('Lexus'),
    ('Infiniti'),
    ('Acura'),
    ('Mitsubishi'),
    ('Tesla'),
    ('Jeep'),
    ('Chrysler'),
    ('Dodge'),
    ('Ram'),
    ('Buick');

-- Insert data into vehicles table
INSERT INTO
    vehicles (
        brand,
        vehicleIdentificationNumber,
        registrationNumber,
        clientEmail,
        clientAddress
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Volkswagen'
        ),
        '1VWAT7A37FC123456',
        'ABC1234',
        'john.doe@example.com',
        '123 Main St, Anytown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Audi'
        ),
        'WAUZFAFR7DA123456',
        'XYZ5678',
        'jane.smith@example.com',
        '456 Elm St, Othertown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Porsche'
        ),
        'WP0AA2A77EL123456',
        'LMN9101',
        'mike.jones@example.com',
        '789 Oak St, Sometown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Skoda'
        ),
        'TMBJG7NE7G0123456',
        'QRS2345',
        'susan.lee@example.com',
        '101 Pine St, Anycity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Fiat'
        ),
        '3C3CFFAR8ET123456',
        'TUV6789',
        'david.brown@example.com',
        '202 Birch St, Othercity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'BMW'
        ),
        'WBA3A5C52DF123456',
        'JKL3456',
        'emma.wilson@example.com',
        '303 Cedar St, Newtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Mercedes-Benz'
        ),
        'WDDGF8AB4EA123456',
        'MNO7890',
        'oliver.thomas@example.com',
        '404 Maple St, Oldtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Toyota'
        ),
        'JTDBT923071234567',
        'PQR1234',
        'charlotte.johnson@example.com',
        '505 Spruce St, Smalltown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Honda'
        ),
        '2HGFB2F50DH123456',
        'STU5678',
        'liam.martin@example.com',
        '606 Willow St, Bigcity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Ford'
        ),
        '1FAHP3F26CL123456',
        'VWX9012',
        'sophia.moore@example.com',
        '707 Ash St, Middletown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Chevrolet'
        ),
        '1G1JC5244R7251234',
        'YZA3456',
        'mason.taylor@example.com',
        '808 Birch St, Anytown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Nissan'
        ),
        'JN1AZ4EH3DM123456',
        'BCD6789',
        'ava.anderson@example.com',
        '909 Cedar St, Othertown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Hyundai'
        ),
        'KMHCT4AE6DU123456',
        'EFG1234',
        'logan.jackson@example.com',
        '1010 Elm St, Sometown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Kia'
        ),
        'KNAFX4A69E5123456',
        'HIJ5678',
        'mia.white@example.com',
        '1111 Oak St, Anycity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Mazda'
        ),
        'JM1BL1VFXA1234567',
        'KLM9101',
        'lucas.harris@example.com',
        '1212 Pine St, Othercity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Subaru'
        ),
        'JF1GPAL68DH123456',
        'NOP2345',
        'amelia.martinez@example.com',
        '1313 Spruce St, Newtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Jaguar'
        ),
        'SAJWA0ES8F8123456',
        'QRS6789',
        'ethan.clark@example.com',
        '1414 Willow St, Oldtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Land Rover'
        ),
        'SALWR2VF4FA123456',
        'TUV1234',
        'isabella.lewis@example.com',
        '1515 Ash St, Smalltown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Volvo'
        ),
        'YV1MS382162123456',
        'WXY5678',
        'james.walker@example.com',
        '1616 Birch St, Bigcity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Mini'
        ),
        'WMWZB3C54DWP12345',
        'ZAB9012',
        'sophia.hall@example.com',
        '1717 Cedar St, Middletown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Lexus'
        ),
        'JTHBK1EG6B2123456',
        'CDE3456',
        'benjamin.young@example.com',
        '1818 Elm St, Anytown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Infiniti'
        ),
        'JN1CV6AP7BM123456',
        'FGH6789',
        'emma.king@example.com',
        '1919 Oak St, Othertown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Acura'
        ),
        '19UUA8F54CA123456',
        'IJK1234',
        'william.scott@example.com',
        '2020 Pine St, Sometown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Mitsubishi'
        ),
        'JA32U2FU8CU123456',
        'LMN5678',
        'olivia.green@example.com',
        '2121 Spruce St, Anycity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Tesla'
        ),
        '5YJSA1E26FF123456',
        'OPQ9101',
        'michael.adams@example.com',
        '2222 Willow St, Othercity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Jeep'
        ),
        '1C4RJFAG6FC123456',
        'RST2345',
        'ava.baker@example.com',
        '2323 Ash St, Newtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Chrysler'
        ),
        '2C3CCARG8EH123456',
        'UVW6789',
        'daniel.carter@example.com',
        '2424 Birch St, Oldtown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Dodge'
        ),
        '2C3CDXBG9DH123456',
        'XYZ1234',
        'sophia.mitchell@example.com',
        '2525 Cedar St, Smalltown, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Ram'
        ),
        '1C6RR7FT5ES123456',
        'ABC5678',
        'james.perez@example.com',
        '2626 Elm St, Bigcity, USA'
    ),
    (
        (
            SELECT
                id
            FROM
                vehicle_brands
            WHERE
                name = 'Buick'
        ),
        '1G4PP5SK5C4123456',
        'DEF9012',
        'mia.roberts@example.com',
        '2727 Oak St, Middletown, USA'
    );