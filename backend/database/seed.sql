
USE obksh;

-- Categories Seed Data

INSERT INTO categories (name, description)
VALUES
(
    'Technology',
    'Books about programming, computers and modern technology.'
),
(
    'Education',
    'Books for learning, studying and academic development.'
),
(
    'Business',
    'Books about business, management and entrepreneurship.'
),
(
    'Fiction',
    'Novels, stories and fictional literature.'
),
(
    'Science',
    'Books about science, research and discoveries.'
),
(
    'History',
    'Books about historical events and civilizations.'
),
(
    'Self Development',
    'Books about personal growth and productivity.'
);


-- Books Seed Data

INSERT INTO books (
    category_id,
    title,
    author,
    isbn,
    description,
    price,
    stock,
    image_url
)
VALUES

(
    1,
    'JavaScript: The Good Parts',
    'Douglas Crockford',
    '9780596517748',
    'A guide to the elegant and useful parts of JavaScript.',
    18000.00,
    15,
    'https://placehold.co/300x400?text=JavaScript'
),

(
    1,
    'Learning TypeScript',
    'Josh Goldberg',
    '9781098110338',
    'A practical introduction to TypeScript.',
    25000.00,
    20,
    'https://placehold.co/300x400?text=TypeScript'
),

(
    1,
    'Clean Code',
    'Robert C. Martin',
    '9780132350884',
    'A handbook of agile software craftsmanship.',
    30000.00,
    10,
    'https://placehold.co/300x400?text=Clean+Code'
),

(
    2,
    'Learning How to Learn',
    'Barbara Oakley',
    '9780143132547',
    'A practical guide to effective learning.',
    20000.00,
    12,
    'https://placehold.co/300x400?text=Learning'
),

(
    3,
    'The Lean Startup',
    'Eric Ries',
    '9780307887894',
    'A method for developing businesses and products.',
    22000.00,
    8,
    'https://placehold.co/300x400?text=Lean+Startup'
),

(
    3,
    'Zero to One',
    'Peter Thiel',
    '9780804139298',
    'Notes on startups and building the future.',
    24000.00,
    9,
    'https://placehold.co/300x400?text=Zero+to+One'
),

(
    4,
    'The Alchemist',
    'Paulo Coelho',
    '9780062315007',
    'A novel about following your dreams.',
    16000.00,
    25,
    'https://placehold.co/300x400?text=Alchemist'
),

(
    5,
    'A Brief History of Time',
    'Stephen Hawking',
    '9780553380163',
    'An exploration of cosmology and the universe.',
    28000.00,
    7,
    'https://placehold.co/300x400?text=Science'
),

(
    6,
    'Sapiens',
    'Yuval Noah Harari',
    '9780062316097',
    'A brief history of humankind.',
    26000.00,
    14,
    'https://placehold.co/300x400?text=Sapiens'
),

(
    7,
    'Atomic Habits',
    'James Clear',
    '9780735211292',
    'A guide to building good habits and breaking bad ones.',
    23000.00,
    18,
    'https://placehold.co/300x400?text=Atomic+Habits'
);
