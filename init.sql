-- Drop tables if they exist (for clean initialization)
DROP TABLE IF EXISTS post CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Create users table
CREATE TABLE "user"
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)        NOT NULL,
    email        VARCHAR(150) UNIQUE NOT NULL,
    provider     VARCHAR(50)         NOT NULL,
    "providerId" VARCHAR(100) UNIQUE NOT NULL
);

-- Insert sample users
INSERT INTO "user" (id, name, email, provider, "providerId")
VALUES
    (1, 'Shubham Gupta', 'shopify.chaz.co.in@gmail.com', 'firebase', 'ESMO4uX4N4QJeavdUIM802EA8d03'),
    (2, 'Harsh Kanjariya', 'code.harshkanjariya@gmail.com', 'firebase', '5rbgSI3PpJejDZQwOqcXLUAKG2K2');

-- Ensure the sequence continues correctly
SELECT setval(pg_get_serial_sequence('"user"', 'id'), COALESCE(MAX(id), 1) + 1, FALSE)
FROM "user";

-- Create posts table (with correct NOT NULL constraints from the start)
CREATE TABLE post
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255)            NOT NULL,
    content     TEXT                    NOT NULL,
    "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT now() NOT NULL,
    "authorId"  INTEGER REFERENCES "user" (id) ON DELETE CASCADE
);

-- Ensure all data has valid `title` values before inserting
INSERT INTO post (id, title, content, "createdAt", "updatedAt", "authorId")
VALUES
    (4, 'The Future of Web Development: Trends & Technologies in 2025',
     $$<h1>The Future of Web Development: Trends & Technologies in 2025</h1>
     <p><strong>Web development is evolving at a rapid pace...</strong></p>
     <h2>1. AI-Powered Development</h2>
     <p>Artificial Intelligence (AI) is making web development faster and smarter...</p>
     <blockquote>
     <p>"AI won’t replace developers, but developers who use AI will replace those who don’t." - Anonymous</p>
     </blockquote>
     <h2>2. Web3 & Blockchain Integration</h2>
     <p>Decentralization is gaining traction. Expect more websites to incorporate <a href="https://ethereum.org/en/" target="_blank" rel="noopener">blockchain technology</a> for authentication, payments, and data security.</p>
        <pre><code>
     pragma solidity ^0.8.0;
contract HelloWorld {
         string public greet = "Hello, Blockchain!";
}
     </code></pre>
     <p><img src="https://source.unsplash.com/800x400/?technology,web" alt="Web Development Future" width="100%"></p>$$,
     now(), now(), 1),

    (5, 'Morse Code: The Timeless Language of Dots and Dashes',
     $$<h1>Morse Code: The Timeless Language of Dots and Dashes</h1>
     <p><strong>Morse code</strong> has played a crucial role in communication...</p>
     <blockquote>
     <p>"What hath God wrought" - The first Morse code message sent in 1844.</p>
     </blockquote>
     <h2>3. Why Is Morse Code Still Used?</h2>
     <ul>
     <li><strong>Emergency Communication</strong> - Used in aviation, navy, and survival situations.</li>
     <li><strong>Amateur Radio (HAM)</strong> - Morse code is an important skill in radio communication.</li>
     </ul>
     <p><img src="https://source.unsplash.com/800x400/?communication,telegraph" alt="Morse Code Communication" width="100%"></p>$$,
     now(), now(), 1),

    (6, 'The Beauty of the Japanese Language: A Journey Through Kanji, Hiragana, and Katakana',
     $$<h1>The Beauty of the Japanese Language: A Journey Through Kanji, Hiragana, and Katakana</h1>
     <p><strong>The Japanese language (日本語 - Nihongo)</strong> is one of the most fascinating and unique languages...</p>
     <h2>1. The Three Writing Systems</h2>
     <h3>1.1 Hiragana (ひらがな)</h3>
     <p>Hiragana is the first writing system that Japanese children learn...</p>
     <p><img src="https://www.omniglot.com/images/writing/japanese.gif" alt="Hiragana and Katakana Chart" width="100%"></p>
     <h3>1.3 Kanji (漢字)</h3>
     <p>Kanji are **Chinese characters adapted into Japanese**...</p>
     <ul>
     <li><strong>日 (Nichi)</strong> - Sun / Day</li>
     <li><strong>本 (Hon)</strong> - Book / Origin</li>
     <li><strong>語 (Go)</strong> - Language</li>
     </ul>
     <p><img src="https://cotoacademy.com/wp-content/uploads/2021/07/japanese-writing-system-explained.jpg" alt="Japanese Writing System" width="100%"></p>
     <h2>4. Fun Fact: The World\'s Shortest Haiku</h2>
     <pre><code>
     古池や (Furu ike ya) - An old pond
     蛙飛び込む (Kawazu tobikomu) - A frog jumps in
     水の音 (Mizu no oto) - The sound of water
     </code></pre>
     <p><img src="https://cdn.britannica.com/19/220619-050-55CE9AC8/Haiku-written-English-Kanji-Japanese-syllables.jpg" alt="Haiku Japanese Poem" width="100%"></p>$$,
     now(), now(), 2);

-- Ensure the sequence continues correctly
SELECT setval(pg_get_serial_sequence('post', 'id'), COALESCE(MAX(id), 1) + 1, FALSE)
FROM post;
