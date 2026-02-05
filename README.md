# Roast My Proposal 🔥

Upload your sales proposal. Get brutally honest feedback. Close more deals.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and add your API key
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with PandaDoc brand colors
- **AI**: Anthropic Claude API
- **PDF Parsing**: pdf-parse

## Project Structure

```
src/
├── app/
│   ├── api/roast/route.ts    # API endpoint for roasting
│   ├── globals.css           # Global styles + Poppins font
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── PDFUploader.tsx       # Drag-drop PDF upload
│   └── RoastResults.tsx      # Results display
└── lib/
    ├── roast-prompt.ts       # Claude prompt engineering
    └── types.ts              # TypeScript types
```

## Customization

### Adjusting the Roast Tone

Edit `src/lib/roast-prompt.ts` to modify:
- Scoring rubric weights
- Roast severity
- Output format

### Brand Colors

PandaDoc colors are defined in `tailwind.config.ts`:
- Primary: #248567 (green)
- Secondary: #D6CEFF (purple)
- Background: #EEE9E1 (warm off-white)

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

Remember to add `ANTHROPIC_API_KEY` to your Vercel environment variables.

## Future Enhancements

- [ ] Roast intensity slider
- [ ] History/account system
- [ ] "Defend My Proposal" counter-feature
- [ ] Team leaderboard
- [ ] PandaDoc integration

---

*Built for Laughs. Accidentally useful.*
