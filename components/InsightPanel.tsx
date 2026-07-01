'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Chart' },
  { key: 'love',        label: 'Love' },
  { key: 'career',      label: 'Career' },
  { key: 'wealth',      label: 'Wealth' },
  { key: 'health',      label: 'Health' },
  { key: 'personality', label: 'Character' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Generate a chart overview in the following structure:

**[Chart Pattern]**
Summarize the core pattern and energy of this chart in one sentence.

**[Major Star Reading]**
Core qualities of the Life Palace major star, citing Ni Haixia's exact words or views.

**[Three Directions]**
Analysis of how Wealth, Career, and Travel palaces interact with the overall pattern.

**[Current Da Xian]**
Direction of the current major period and the most important thing to watch.

**[Strengths & Cautions]**
Innate chart strengths and risks or life lessons to be mindful of.`,

  love: `Provide a deep analysis of love and marriage in the following structure:

**[Relationship Pattern]**
Characterize the love and marriage chart pattern in one sentence.

**[Spouse Palace Analysis]**
Major star and Si Hua in the Spouse Palace, with Ni Haixia system interpretation.

**[Palace Interactions]**
How related palaces affect the relationship picture.

**[Current Da Xian Love Outlook]**
Relationship trajectory over the current 10-year period and key turning points.

**[Practical Advice]**
Concrete, actionable relationship guidance.`,

  career: `Provide a deep analysis of career in the following structure:

**[Career Pattern]**
Characterize the career chart pattern in one sentence — employment vs. entrepreneurship.

**[Career Palace Analysis]**
Major star and Si Hua in the Career Palace, with Ni Haixia's judgment for this configuration.

**[Wealth Palace Interaction]**
Relationship between wealth and career, analysis of income sources.

**[Current Da Xian Career Outlook]**
Career trajectory over the current 10-year period.

**[Practical Advice]**
Suitable directions, industries, and strategies.`,

  wealth: `Provide a deep analysis of wealth in the following structure:

**[Wealth Pattern]**
Characterize the wealth pattern in one sentence — active vs. passive income.

**[Wealth Palace Analysis]**
Major star and Si Hua in the Wealth Palace, wealth sources and flow.

**[Property Palace (Wealth Vault)]**
Saving ability and real estate fortune analysis.

**[Current Da Xian Wealth Outlook]**
Wealth trajectory and key cautions in the current period.

**[Financial Advice]**
Concrete financial guidance.`,

  health: `Analyze health fortune in the following structure:

**[Health Palace Stars]**
Stars in the Health Palace and their health meanings.

**[Main Risks]**
Key health risks and body areas to watch, incorporating Ni Haixia's meridian-clock theory.

**[Da Xian Health Trend]**
Current health trajectory and important time windows.

**[Prevention Tips]**
Specific precautions and wellness directions.`,

  personality: `Provide a deep analysis of personality in the following structure:

**[Life Palace Star Personality]**
Core personality traits of the Life Palace major star, citing Ni Haixia's words.

**[Three-Direction Personality Overview]**
How Wealth, Career, and Travel palaces shape the overall personality.

**[Interpersonal Style]**
How this person interacts with others and navigates relationships.

**[Strengths & Life Lessons]**
Innate strengths and the life lessons this person must face.`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   'Self, personality, innate chart pattern',
  '兄弟宫': 'Siblings, business partners',
  '夫妻宫': 'Romantic relationships, marriage',
  '子女宫': 'Children, subordinates',
  '财帛宫': 'Wealth sources, income pattern',
  '疾厄宫': 'Physical health, accidents',
  '迁移宫': 'Travel, external opportunities, social network',
  '交友宫': 'Friends, benefactors, adversaries',
  '官禄宫': 'Career achievements, social status',
  '田宅宫': 'Real estate, home environment',
  '福德宫': 'Spiritual wellbeing, inner contentment',
  '父母宫': 'Parental relationships, documents and contracts',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate chart overview on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? ' Hua-' + s.siHua : ''}`).join(', ')
      : 'Empty palace (borrow from opposite)';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `Analyze the [${selectedPalace.name}] palace (governs: ${role}). The major star(s) are ${starDesc}. Structure your response as:

**[Palace Character]**
Meaning of ${selectedPalace.name} in the chart, and overall judgment of this star configuration.

**[Major Star Reading]**
Ni Haixia system interpretation of the major star in this palace, citing specific views.

**[Three-Direction Interactions]**
How the three-direction and four-cardinal palaces influence this palace.

**[Practical Advice]**
Concrete advice based on this palace.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject Si Hua flying-star analysis on click
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // Find which palace contains this star
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'Unknown palace';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Da Xian' : 'Liu Nian';

    const prompt = `Analyze the flying-star effect of [${viewLabel} ${selectedSiHua.starName} Hua-${selectedSiHua.siHua}] in the following structure:

**[Hua-${selectedSiHua.siHua} Core Meaning]**
Core meaning of Hua-${selectedSiHua.siHua} in the Ni Haixia system, and the specific meaning of ${selectedSiHua.starName} transforming to Hua-${selectedSiHua.siHua}.

**[Landing Palace Effect]**
${selectedSiHua.starName} Hua-${selectedSiHua.siHua} lands in [${palaceName}] — how does it affect that palace's domain? What is Ni Haixia's interpretation?

**[Three-Direction Flying Path]**
After Hua-${selectedSiHua.siHua} enters ${palaceName}, how does it ripple through its three-direction and four-cardinal palaces?

**[Current Fortune Impact]**
In the ${viewLabel} time frame, how does this Hua-${selectedSiHua.siHua} specifically affect the person's near-term fortune?

**[Practical Advice]**
Concrete actionable advice based on this Si Hua configuration.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (!res.ok) throw new Error('Request failed');
      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Interpretation failed. Please try again.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Generating chart reading…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  Chart Reading
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask a follow-up question…"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Ask'}
          </button>
        </div>
      </div>

    </div>
  );
}
