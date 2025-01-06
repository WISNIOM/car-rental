SET NAMES utf8mb4;

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

-- Insert addresses
INSERT INTO
    addresses (street, city, administrativeArea, postalCode, country)
VALUES
    ('ul. Marszałkowska 1', 'Warszawa', 'Mazowieckie', '00-001', 'Polska'),
    ('ul. Piotrkowska 2', 'Łódź', 'Łódzkie', '90-001', 'Polska'),
    ('ul. Długa 3', 'Kraków', 'Małopolskie', '30-001', 'Polska'),
    ('ul. Półwiejska 4', 'Poznań', 'Wielkopolskie', '61-001', 'Polska'),
    ('ul. Świdnicka 5', 'Wrocław', 'Dolnośląskie', '50-001', 'Polska'),
    ('ul. Główna 6', 'Gdańsk', 'Pomorskie', '80-001', 'Polska'),
    ('ul. Szeroka 7', 'Szczecin', 'Zachodniopomorskie', '70-001', 'Polska'),
    ('ul. Krótka 8', 'Bydgoszcz', 'Kujawsko-Pomorskie', '85-001', 'Polska'),
    ('ul. Nowa 9', 'Lublin', 'Lubelskie', '20-001', 'Polska'),
    ('ul. Stara 10', 'Katowice', 'Śląskie', '40-001', 'Polska'),
    ('ul. Wąska 11', 'Białystok', 'Podlaskie', '15-001', 'Polska'),
    ('ul. Słoneczna 12', 'Rzeszów', 'Podkarpackie', '35-001', 'Polska'),
    ('ul. Zielona 13', 'Opole', 'Opolskie', '45-001', 'Polska'),
    ('ul. Jasna 14', 'Kielce', 'Świętokrzyskie', '25-001', 'Polska'),
    ('ul. Cicha 15', 'Olsztyn', 'Warmińsko-Mazurskie', '10-001', 'Polska'),
    ('ul. Leśna 16', 'Zielona Góra', 'Lubuskie', '65-001', 'Polska'),
    ('ul. Polna 17', 'Gorzów Wielkopolski', 'Lubuskie', '66-001', 'Polska'),
    ('ul. Wrocławska 18', 'Legnica', 'Dolnośląskie', '59-001', 'Polska'),
    ('ul. Warszawska 19', 'Radom', 'Mazowieckie', '26-001', 'Polska'),
    ('ul. Krakowska 20', 'Tarnów', 'Małopolskie', '33-001', 'Polska'),
    ('ul. Poznańska 21', 'Kalisz', 'Wielkopolskie', '62-001', 'Polska'),
    ('ul. Łódzka 22', 'Piotrków Trybunalski', 'Łódzkie', '97-001', 'Polska'),
    ('ul. Górna 23', 'Wałbrzych', 'Dolnośląskie', '58-001', 'Polska'),
    ('ul. Dolna 24', 'Koszalin', 'Zachodniopomorskie', '75-001', 'Polska'),
    ('ul. Środkowa 25', 'Słupsk', 'Pomorskie', '76-001', 'Polska'),
    ('ul. Wschodnia 26', 'Elbląg', 'Warmińsko-Mazurskie', '82-001', 'Polska'),
    ('ul. Zachodnia 27', 'Płock', 'Mazowieckie', '09-001', 'Polska'),
    ('ul. Północna 28', 'Ostrołęka', 'Mazowieckie', '07-001', 'Polska'),
    ('ul. Południowa 29', 'Siedlce', 'Mazowieckie', '08-001', 'Polska'),
    ('ul. Centralna 30', 'Przemyśl', 'Podkarpackie', '37-001', 'Polska'),
    ('ul. 11 Listopada 31', 'Bielsko-Biała', 'Śląskie', '43-300', 'Polska');

-- Insert data into vehicles table
INSERT INTO
    vehicles (
        brandId,
        vehicleIdentificationNumber,
        registrationNumber,
        clientEmail,
        clientAddressId
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
        1
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
        2
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
        3
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
        4
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
        5
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
        6
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
        7
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
        8
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
        9
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
        10
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
        11
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
        12
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
        13
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
        14
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
        15
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
        16
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
        17
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
        18
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
        19
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
        20
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
        21
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
        22
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
        23
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
        24
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
        25
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
        26
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
        27
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
        28
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
        29
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
        30
    );