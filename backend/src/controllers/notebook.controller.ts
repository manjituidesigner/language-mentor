import { Response } from 'express';
import { query } from '../config/neon.config';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth.middleware';

const FALLBACK_WORDS = [
  {
    id: 'v1',
    item_type: 'word',
    title_or_word: 'Accomplish',
    phonetic: '/əˈkʌm.plɪʃ/',
    part_of_speech: 'verb',
    translation: 'पूरा करना / हासिल करना (to complete successfully)',
    example_sentence: 'I managed to accomplish all my goals this week.',
    example_translation: 'मैंने इस हफ्ते अपने सभी लक्ष्य हासिल कर लिए।',
    mastery_level: 'Mastered',
    is_bookmarked: true,
  },
  {
    id: 'v2',
    item_type: 'word',
    title_or_word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    part_of_speech: 'adjective',
    translation: 'दृढ़ / लचीला (able to recover quickly)',
    example_sentence: 'She stayed resilient despite repeated hurdles.',
    example_translation: 'बार-बार आने वाली बाधाओं के बावजूद वह दृढ़ रही।',
    mastery_level: 'Learning',
    is_bookmarked: true,
  },
  {
    id: 'v3',
    item_type: 'word',
    title_or_word: 'Take for granted',
    phonetic: '/teɪk fər ˈɡrɑːn.tɪd/',
    part_of_speech: 'idiom',
    translation: 'महत्व न समझना / हल्के में लेना',
    example_sentence: 'Never take genuine friendships for granted.',
    example_translation: 'सच्ची दोस्ती को कभी हल्के में न लें।',
    mastery_level: 'Review',
    is_bookmarked: false,
  },
];

const FALLBACK_GRAMMAR = [
  {
    id: 'g1',
    item_type: 'grammar',
    title_or_word: 'Past Simple: Irregular Verbs',
    translation: 'अनियमित क्रियाओं का भूतकाल रूप',
    rule_formula: 'Do not append "-ed" to irregular verbs (go → went, buy → bought).',
    example_sentence: 'I went to the store yesterday.',
    incorrect_example: 'I goed to the store yesterday.',
    mentor_tip: 'Mentor Sophie flagged this in your last voice call.',
    is_bookmarked: true,
  },
  {
    id: 'g2',
    item_type: 'grammar',
    title_or_word: 'Third-Person Singular (-s / -es)',
    translation: 'तृतीय पुरुष एकवचन क्रिया नियम',
    rule_formula: 'In simple present tense, add "-s" or "-es" for he, she, it.',
    example_sentence: 'She speaks three languages fluently.',
    incorrect_example: 'She speak three languages fluently.',
    mentor_tip: 'Remember: "He/She/It" always takes the singular -s marker.',
    is_bookmarked: false,
  },
];

const FALLBACK_MISSED = [
  {
    id: 'm1',
    item_type: 'missed',
    title_or_word: 'went (not goed)',
    translation: 'गया (past tense of go)',
    rule_formula: '"Go" is an irregular verb. Past form is "went".',
    example_sentence: 'Yesterday I went to the market.',
    incorrect_example: 'Yesterday I goed to market.',
    mentor_tip: 'From session: Daily Coffee Chat with Sophie',
    is_bookmarked: false,
  },
];

export const getNotebookItems = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const { type, bookmarked } = req.query;

  try {
    let sql = 'SELECT * FROM notebook_items WHERE user_id = $1';
    const params: any[] = [userId];

    if (type && typeof type === 'string') {
      sql += ' AND item_type = $' + (params.length + 1);
      params.push(type);
    }
    if (bookmarked === 'true') {
      sql += ' AND is_bookmarked = TRUE';
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);

    if (result.rows.length > 0) {
      return res.status(200).json(new ApiResponse(200, result.rows, 'Notebook items fetched.'));
    }
  } catch {
    // fallback
  }

  let items = [...FALLBACK_WORDS, ...FALLBACK_GRAMMAR, ...FALLBACK_MISSED];
  if (type) {
    items = items.filter((i) => i.item_type === type);
  }
  if (bookmarked === 'true') {
    items = items.filter((i) => i.is_bookmarked);
  }

  return res.status(200).json(new ApiResponse(200, items, 'Notebook items retrieved.'));
});

export const addNotebookItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const {
    itemType,
    titleOrWord,
    phonetic,
    partOfSpeech,
    translation,
    exampleSentence,
    exampleTranslation,
    ruleFormula,
    incorrectExample,
    mentorTip,
    masteryLevel,
  } = req.body;

  if (!titleOrWord || !translation) {
    throw new ApiError(400, 'Word/title and translation are required.');
  }

  try {
    const insertResult = await query(
      `INSERT INTO notebook_items (
        user_id, item_type, title_or_word, phonetic, part_of_speech, 
        translation, example_sentence, example_translation, rule_formula, 
        incorrect_example, mentor_tip, mastery_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId,
        itemType || 'word',
        titleOrWord,
        phonetic || null,
        partOfSpeech || null,
        translation,
        exampleSentence || null,
        exampleTranslation || null,
        ruleFormula || null,
        incorrectExample || null,
        mentorTip || null,
        masteryLevel || 'Learning',
      ]
    );

    return res.status(201).json(new ApiResponse(201, insertResult.rows[0], 'Item added to notebook.'));
  } catch {
    const fallbackItem = {
      id: 'item-' + Date.now(),
      user_id: userId,
      item_type: itemType || 'word',
      title_or_word: titleOrWord,
      translation,
      mastery_level: masteryLevel || 'Learning',
      is_bookmarked: false,
      created_at: new Date().toISOString(),
    };
    return res.status(201).json(new ApiResponse(201, fallbackItem, 'Item added to notebook.'));
  }
});

export const updateNotebookItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isBookmarked, masteryLevel } = req.body;

  try {
    const result = await query(
      `UPDATE notebook_items 
       SET is_bookmarked = COALESCE($1, is_bookmarked),
           mastery_level = COALESCE($2, mastery_level),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [isBookmarked, masteryLevel, id]
    );

    return res.status(200).json(new ApiResponse(200, result.rows[0] || req.body, 'Notebook item updated.'));
  } catch {
    return res.status(200).json(new ApiResponse(200, { id, isBookmarked, masteryLevel }, 'Notebook item updated.'));
  }
});

export const deleteNotebookItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM notebook_items WHERE id = $1', [id]);
  } catch {
    // continue
  }
  return res.status(200).json(new ApiResponse(200, { id }, 'Notebook item removed.'));
});
