'use client';

import { RoastResult } from '@/lib/types';
import { Trophy, Flame, Wrench, Heart, Share2, Twitter, Linkedin, Link } from 'lucide-react';
import { useState } from 'react';

interface RoastResultsProps {
  result: RoastResult;
  onReset: () => void;
}

const dimensionLabels: Record<string, string> = {
  valuePropClarity: 'Value Prop Clarity',
  pricingConfidence: 'Pricing Confidence',
  socialProof: 'Social Proof',
  urgencyFomo: 'Urgency/FOMO',
  competitorAwareness: 'Competitor Awareness',
  jargonDensity: 'Jargon Score',
};

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'text-panda-green';
  if (grade.startsWith('B')) return 'text-panda-green/70';
  if (grade.startsWith('C')) return 'text-panda-warning';
  if (grade.startsWith('D')) return 'text-panda-error/70';
  return 'text-panda-error';
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'bg-panda-green';
  if (score >= 6) return 'bg-panda-green/70';
  if (score >= 4) return 'bg-panda-warning';
  return 'bg-panda-error';
};

export default function RoastResults({ result, onReset }: RoastResultsProps) {
  const [copied, setCopied] = useState(false);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `My sales proposal just got roasted: ${result.letterGrade} (${result.overallScore}/100). Brutal but fair. 🔥`;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Overall Score Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className={`text-8xl font-bold mb-2 ${getGradeColor(result.letterGrade)}`}>
          {result.letterGrade}
        </div>
        <div className="text-2xl text-panda-text/60 mb-4">{result.overallScore}/100</div>
        <p className="text-lg italic text-panda-text/80">"{result.verdict}"</p>
      </div>

      {/* Dimension Scores */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-panda-warning" />
          Score Breakdown
        </h3>
        <div className="space-y-4">
          {Object.entries(result.dimensions).map(([key, dimension]) => (
            <div key={key}>
              <button
                onClick={() => setExpandedDimension(expandedDimension === key ? null : key)}
                className="w-full text-left"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium hover:text-panda-green transition-colors cursor-pointer">
                    {dimensionLabels[key]} {expandedDimension === key ? '▼' : '▶'}
                  </span>
                  <span className="font-semibold">{dimension.score}/10</span>
                </div>
                <div className="h-3 bg-panda-bg rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <div
                    className={`h-full rounded-full score-bar ${getScoreColor(dimension.score)}`}
                    style={{ '--score-width': `${dimension.score * 10}%` } as React.CSSProperties}
                  />
                </div>
              </button>
              {expandedDimension === key && (
                <div className="mt-3 p-4 bg-panda-bg/50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <p className="text-sm font-semibold text-panda-text/70 mb-1">Why this score:</p>
                    <p className="text-sm text-panda-text">{dimension.reasoning}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-panda-text/70 mb-2">Examples from your proposal:</p>
                    <div className="space-y-2">
                      {dimension.examples.map((example, idx) => (
                        <p key={idx} className="text-sm text-panda-text italic bg-white p-3 rounded border-l-4 border-panda-green">
                          "{example}"
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The Roast */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5 text-panda-error" />
          The Roast 🔥
        </h3>
        <div className="space-y-4">
          {result.roasts.map((roast, index) => (
            <div
              key={index}
              className="fade-in-up bg-panda-error/5 border-l-4 border-panda-error p-4 rounded-r-lg"
            >
              <p className="text-panda-text/80 italic">"{roast}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Fix It */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-panda-green" />
          How to Fix It
        </h3>
        <div className="space-y-6">
          {result.fixes.map((fix, index) => (
            <div key={index} className="fade-in-up">
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                <div className="bg-panda-error/5 p-4 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-panda-error mb-2 font-semibold">Before</p>
                  <p className="text-panda-text/70 line-through">{fix.before}</p>
                </div>
                <div className="bg-panda-green/5 p-4 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-panda-green mb-2 font-semibold">After</p>
                  <p className="text-panda-text">{fix.after}</p>
                </div>
              </div>
              <p className="text-sm text-panda-text/60 italic">{fix.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* One Nice Thing */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-panda-purple" />
          Okay, One Nice Thing...
        </h3>
        <p className="text-panda-text/80 bg-panda-purple/10 p-4 rounded-lg">
          {result.niceThing}
        </p>
      </div>

      {/* Share Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-panda-green" />
          Share Your Roast
        </h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#094d92] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-panda-text hover:bg-panda-text/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Link className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Try Again */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-panda-green hover:bg-panda-green/90 text-white font-semibold py-4 px-8 rounded-xl transition-colors"
        >
          🔥 Roast Another Proposal
        </button>
      </div>
    </div>
  );
}
