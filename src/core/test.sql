create TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    firebasetokens TEXT[],
    phoneNumber INT NOT NULL,
    password VARCHAR(255) NOT NULL
);

create TABLE room (
    id SERIAL PRIMARY KEY,
    chat INT,
    users INT[] NOT NULL
);

create TABLE chat (
    id SERIAL PRIMARY KEY,
    text TEXT,
    file varchar(255) ,
    room INT NOT NULL,
    fromUser INT NOT NULL,
    toUser INT NOT NULL
);