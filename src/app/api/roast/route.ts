import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import pdf from 'pdf-parse';
import { ROAST_SYSTEM_PROMPT, ROAST_USER_PROMPT } from '@/lib/roast-prompt';
import { RoastResult } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let proposalText: string;
    try {
      const pdfData = await pdf(buffer);
      proposalText = pdfData.text;
    } catch (pdfError) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse PDF. Please ensure it contains readable text.' },
        { status: 400 }
      );
    }

    if (proposalText.length < 100) {
      return NextResponse.json(
        { success: false, error: 'Could not extract enough text from this PDF. It may be image-based or corrupted.' },
        { status: 400 }
      );
    }

    // Truncate if too long (Claude context limits)
    if (proposalText.length > 50000) {
      proposalText = proposalText.substring(0, 50000);
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: ROAST_USER_PROMPT(proposalText),
        },
      ],
      system: ROAST_SYSTEM_PROMPT,
    });

    // Extract text content from response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Parse JSON response
    let roastResult: RoastResult;
    try {
      // Clean potential markdown formatting
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      roastResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: roastResult });
  } catch (error) {
    console.error('Roast API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, error: `API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
