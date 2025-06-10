const claudeClient = require('../config/claude');

exports.generateLesson = async (prompt, subject, grade, difficulty) => {
  try {
    const systemPrompt = `You are an expert educational content creator. Generate a comprehensive lesson plan for ${subject} at ${grade} level with ${difficulty} difficulty.`;

    const userPrompt = `${prompt}

Please provide:
1. A clear lesson description (2-3 sentences)
2. Detailed lesson content with examples
3. 5 practice exercises with multiple choice questions
4. Estimated duration in minutes

Format the response as JSON with the following structure:
{
  "description": "...",
  "content": "...",
  "exercises": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A",
      "explanation": "..."
    }
  ],
  "estimatedDuration": 30
}`;

    const response = await claudeClient.post('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    const content = response.data.content[0].text;

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const lessonData = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!lessonData.description || !lessonData.content || !lessonData.exercises) {
      throw new Error('Incomplete lesson data from AI');
    }

    return lessonData;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate lesson with AI');
  }
};

exports.generateExercises = async (lessonContent, count = 5) => {
  try {
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Based on this lesson content: "${lessonContent}"

          Generate ${count} multiple choice questions with 4 options each.

          Format as JSON array:
          [
            {
              "question": "...",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correctAnswer": "A",
              "explanation": "..."
            }
          ]`
        }
      ]
    });

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate exercises with AI');
  }
};
