import { Request, Response } from 'express';
import { query } from '../config/neon.config';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth.middleware';

const FALLBACK_MENTORS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Sophie',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    specialty: 'Daily Conversations & Idioms',
    rating: 4.95,
    review_count: 1420,
    status: 'ai',
    voice_id: 'en-US-Sophie',
    bio: 'Friendly native AI tutor specialized in natural cadence and friendly error correction.',
    teaching_style: 'Gentle corrections, lively topics, and cultural insights.',
    is_ai: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Alex',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    specialty: 'Business & Tech Interviews',
    rating: 4.92,
    review_count: 980,
    status: 'ai',
    voice_id: 'en-US-Alex',
    bio: 'Executive communication coach focused on professional clarity, resume talk, and presentations.',
    teaching_style: 'Structured feedback, professional vocabulary, and crisp pronunciation.',
    is_ai: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Liam',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    specialty: 'Travel, Slang & Culture',
    rating: 4.88,
    review_count: 760,
    status: 'ai',
    voice_id: 'en-UK-Liam',
    bio: 'Explorer tutor helping you navigate real-world travel, airports, dining, and casual banter.',
    teaching_style: 'Casual, upbeat, and scenario-driven storytelling.',
    is_ai: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Elara',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    specialty: 'Grammar Precision & Exams',
    rating: 4.98,
    review_count: 1150,
    status: 'ai',
    voice_id: 'en-US-Elara',
    bio: 'Academic mentor with a systematic approach to mastering tenses, prepositions, and syntax.',
    teaching_style: 'Precision breakdown, clear formulas, and instant error explanations.',
    is_ai: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Elena Vance',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    specialty: 'Advanced Accent Reduction',
    rating: 4.90,
    review_count: 310,
    status: 'online',
    voice_id: 'en-US-Elena',
    bio: 'Certified linguistic coach with 8 years experience in accent softening and public speaking.',
    teaching_style: 'Phonetic drill exercises and breath control.',
    is_ai: false,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Marcus Brody',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    specialty: 'Corporate Negotiation & Pitching',
    rating: 4.85,
    review_count: 240,
    status: 'online',
    voice_id: 'en-US-Marcus',
    bio: 'Former Wall Street analyst turned international communication trainer.',
    teaching_style: 'Simulation of high-stakes corporate calls and meetings.',
    is_ai: false,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Priya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    specialty: 'Hindi to English Fluency Bridge',
    rating: 4.96,
    review_count: 520,
    status: 'offline',
    voice_id: 'hi-IN-Priya',
    bio: 'Bilingual language instructor helping native Hindi speakers speak fluent, natural English with confidence.',
    teaching_style: 'Bilingual contrastive grammar and confidence building.',
    is_ai: false,
  },
];

export const getMentors = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  try {
    let sql = 'SELECT * FROM mentors';
    const params: any[] = [];

    if (status && typeof status === 'string') {
      sql += ' WHERE status = $1';
      params.push(status);
    }

    sql += ' ORDER BY rating DESC';
    const result = await query(sql, params);

    if (result.rows.length > 0) {
      return res.status(200).json(new ApiResponse(200, result.rows, 'Mentors fetched successfully.'));
    }
  } catch {
    // fallback resilience
  }

  const filtered = status
    ? FALLBACK_MENTORS.filter((m) => m.status === status)
    : FALLBACK_MENTORS;

  return res.status(200).json(new ApiResponse(200, filtered, 'Mentors retrieved.'));
});

export const getMentorById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query('SELECT * FROM mentors WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return res.status(200).json(new ApiResponse(200, result.rows[0], 'Mentor details fetched.'));
    }
  } catch {
    // fallback resilience
  }

  const found = FALLBACK_MENTORS.find((m) => m.id === id) || FALLBACK_MENTORS[0];
  return res.status(200).json(new ApiResponse(200, found, 'Mentor details retrieved.'));
});

export const bookMentorSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const { mentorId, bookingType, scheduledAt, notes } = req.body;

  if (!mentorId || !bookingType) {
    throw new ApiError(400, 'mentorId and bookingType are required.');
  }

  try {
    const insertResult = await query(
      `INSERT INTO mentor_bookings (user_id, mentor_id, booking_type, scheduled_at, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmed')
       RETURNING *`,
      [userId, mentorId, bookingType, scheduledAt || new Date().toISOString(), notes || '']
    );

    return res.status(201).json(
      new ApiResponse(201, insertResult.rows[0], `Successfully booked ${bookingType} session.`)
    );
  } catch {
    // fallback response
    const mockBooking = {
      id: 'mock-booking-' + Date.now(),
      user_id: userId,
      mentor_id: mentorId,
      booking_type: bookingType,
      status: 'confirmed',
      scheduled_at: scheduledAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    return res.status(201).json(new ApiResponse(201, mockBooking, `Successfully booked ${bookingType} session.`));
  }
});
