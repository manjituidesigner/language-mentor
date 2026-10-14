-- =========================================================
-- AI Language Mentor — Neon Postgres Relational Database DDL
-- =========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    native_language VARCHAR(50) DEFAULT 'hi',
    native_language_name VARCHAR(100) DEFAULT 'Hindi (हिन्दी)',
    learning_language VARCHAR(50) DEFAULT 'en',
    learning_language_name VARCHAR(100) DEFAULT 'English',
    proficiency_level VARCHAR(50) DEFAULT 'A2 Elementary',
    daily_goal_minutes INT DEFAULT 15,
    streak_days INT DEFAULT 12,
    streak_freeze_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.90,
    review_count INT DEFAULT 120,
    status VARCHAR(20) NOT NULL CHECK (status IN ('online', 'offline', 'group', 'ai')),
    voice_id VARCHAR(50) DEFAULT 'en-US-Sophie',
    voice_sample_url TEXT,
    bio TEXT,
    teaching_style TEXT,
    languages_spoken JSONB DEFAULT '["English", "Hindi"]'::jsonb,
    is_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Discussion Groups Table
CREATE TABLE IF NOT EXISTS discussion_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    member_count INT DEFAULT 1,
    active_speakers INT DEFAULT 1,
    level VARCHAR(50) DEFAULT 'All Levels',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    cefr_level VARCHAR(50) NOT NULL,
    scores JSONB NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sessions Table (Chat & Voice Calls)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('chat', 'voice')),
    topic VARCHAR(255) NOT NULL,
    duration_seconds INT DEFAULT 0,
    words_spoken INT DEFAULT 0,
    fluency_score INT DEFAULT 85,
    grammar_errors_count INT DEFAULT 0,
    mentor_observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Session Messages Table
CREATE TABLE IF NOT EXISTS session_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'mentor', 'system')),
    content TEXT NOT NULL,
    translation TEXT,
    corrections JSONB DEFAULT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notebook Items Table (Vocabulary & Grammar Rules)
CREATE TABLE IF NOT EXISTS notebook_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('word', 'grammar', 'missed')),
    title_or_word VARCHAR(255) NOT NULL,
    phonetic VARCHAR(100),
    part_of_speech VARCHAR(50),
    translation TEXT NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    rule_formula TEXT,
    incorrect_example TEXT,
    mentor_tip TEXT,
    mastery_level VARCHAR(20) DEFAULT 'Learning' CHECK (mastery_level IN ('Mastered', 'Learning', 'Review')),
    is_bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    questions JSONB NOT NULL,
    score INT DEFAULT 0,
    total_questions INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Progress Records Table
CREATE TABLE IF NOT EXISTS progress_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    speaking_minutes INT DEFAULT 0,
    sessions_completed INT DEFAULT 0,
    words_learned INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 10. Mentor Bookings / Requests Table
CREATE TABLE IF NOT EXISTS mentor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('chat', 'call', 'session', 'request')),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- Indexes for High Performance Queries
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_mentors_status ON mentors(status);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_notebook_user_type ON notebook_items(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_progress_user_date ON progress_records(user_id, date);

-- =========================================================
-- Default Seed Fixtures
-- =========================================================

-- Insert AI Mentors
INSERT INTO mentors (id, name, avatar_url, specialty, rating, review_count, status, voice_id, bio, teaching_style, is_ai)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Sophie', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop', 'Daily Conversations & Idioms', 4.95, 1420, 'ai', 'en-US-Sophie', 'Friendly native AI tutor specialized in natural cadence and friendly error correction.', 'Gentle corrections, lively topics, and cultural insights.', TRUE),
('22222222-2222-2222-2222-222222222222', 'Alex', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', 'Business & Tech Interviews', 4.92, 980, 'ai', 'en-US-Alex', 'Executive communication coach focused on professional clarity, resume talk, and presentations.', 'Structured feedback, professional vocabulary, and crisp pronunciation.', TRUE),
('33333333-3333-3333-3333-333333333333', 'Liam', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop', 'Travel, Slang & Culture', 4.88, 760, 'ai', 'en-UK-Liam', 'Explorer tutor helping you navigate real-world travel, airports, dining, and casual banter.', 'Casual, upbeat, and scenario-driven storytelling.', TRUE),
('44444444-4444-4444-4444-444444444444', 'Elara', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop', 'Grammar Precision & Exams (IELTS/TOEFL)', 4.98, 1150, 'ai', 'en-US-Elara', 'Academic mentor with a systematic approach to mastering tenses, prepositions, and syntax.', 'Precision breakdown, clear formulas, and instant error explanations.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert Human Mentors (Online / Offline)
INSERT INTO mentors (id, name, avatar_url, specialty, rating, review_count, status, voice_id, bio, teaching_style, is_ai)
VALUES 
('55555555-5555-5555-5555-555555555555', 'Elena Vance', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop', 'Advanced Accent Reduction', 4.90, 310, 'online', 'en-US-Elena', 'Certified linguistic coach with 8 years experience in accent softening and public speaking.', 'Phonetic drill exercises and breath control.', FALSE),
('66666666-6666-6666-6666-666666666666', 'Marcus Brody', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop', 'Corporate Negotiation & Pitching', 4.85, 240, 'online', 'en-US-Marcus', 'Former Wall Street analyst turned international communication trainer.', 'Simulation of high-stakes corporate calls and meetings.', FALSE),
('77777777-7777-7777-7777-777777777777', 'Priya Sharma', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop', 'Hindi to English Fluency Bridge', 4.96, 520, 'offline', 'hi-IN-Priya', 'Bilingual language instructor helping native Hindi speakers speak fluent, natural English with confidence.', 'Bilingual contrastive grammar and confidence building.', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert Discussion Groups
INSERT INTO discussion_groups (id, title, topic, language, member_count, active_speakers, level, image_url)
VALUES 
('88888888-8888-8888-8888-888888888881', 'Hindi & English Fluency Hub', 'Everyday conversation practice, translating thoughts from Hindi to English seamlessly.', 'English', 342, 12, 'Intermediate (B1)', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop'),
('88888888-8888-8888-8888-888888888882', 'Tech & Startup English Circle', 'Discussing AI innovations, system design, mock interviews, and work presentations.', 'English', 189, 7, 'Advanced (B2-C1)', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'),
('88888888-8888-8888-8888-888888888883', 'Global Travel & Cultural Exchange', 'Sharing wanderlust tales, airport navigation tips, food ordering, and polite slang.', 'English', 215, 9, 'All Levels', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop')
ON CONFLICT (id) DO NOTHING;
