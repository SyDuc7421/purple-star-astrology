'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// Per-star detailed reading in the Ni Haixia system (sources: Gu Xianghong's Complete Flying-Stars Zi Wei and Nanbeishanren's Complete Zi Wei)
// Luận giải chi tiết từng sao theo hệ thống Nghê Hải Hạ (nguồn: Phi Tinh Tử Vi Toàn Thư của Cổ Tương Hồng và Tử Vi Toàn Thư của Nam Bắc Sơn Nhân)
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Ni Haixia sees Zi Wei as the Emperor Star — those born with it in the Life Palace have a proud, solitary quality and dislike being controlled. Zi Wei needs Zuo Fu and You Bi flanking it to express its imperial nature; otherwise it is a lone ruler, rich but not noble. Zi Wei is best in Chen or Xu palace, paired with Tian Fu for a double-star pattern of wealth and status. It fears co-residence with Huo Xing, Ling Xing, Qing Yang, or Tuo Luo — sha stars strip it of wealth, leaving only empty prestige.',
    classical: 'Classical maxim: "Zi Wei, the Emperor\'s throne, graces the Life Palace with honor — commanding all stars, the native achieves authority and prominence." Nanbeishanren notes: "Zi Wei in Chen palace brings wealth and career in harmony, reaching the rank of the Three Dukes; in Zi palace the fortune does not last."',
    bestPalace: 'Life Palace (Chen/Xu), Career Palace',
    worstPalace: 'Health Palace, Spouse Palace',
    career: 'Politics, senior management, independent entrepreneurship — innate imperial bearing, best in solo leadership roles',
    relationship: 'Passive in love, strong ego — prefers the other party to pursue; tends toward solitude; marrying later in life is auspicious',
    wealth: 'Steady wealth fortune, better at preservation than accumulation; Chen/Xu placement brings wealth and career in balance — best suited for long-term investment',
    health: 'Earth element — watch the spleen, stomach, and digestive system. Avoid overwork; maintain a regular routine',
  },
  '天机': {
    niHaixia: 'Ni Haixia calls Tian Ji the Strategist Star — the most clever of all stars, but cleverness that shows on the surface harms the body. Tian Ji Hua Ji is the most troublesome: the mind outsmarting itself. Wood element, adaptable and nimble; those with it in the Life Palace think quickly but often over-plan and under-decide. They must leave their hometown to thrive — flexibility and quick adaptation are their greatest assets.',
    classical: 'Classical maxim: "A sharp and calculating person, fond of commerce — Tian Ji (wood) sees opportunity in trade; must leave home and family to prosper, strategy demands distance from kin." Nanbeishanren notes: "In bright positions Tian Ji brings shrewdness and planning ability; in dim positions the light fades and commerce becomes the path."',
    bestPalace: 'Life Palace (Mao), Career Palace',
    worstPalace: 'Spouse Palace',
    career: 'Technical expert, strategist, researcher, IT, planning — brainwork over manual work; best developed away from home',
    relationship: 'Changeable in love, over-thinking makes commitment hard; better to marry later and practice letting go of overthinking',
    wealth: 'Earns through intelligence and skill; not a natural saver — stable wealth comes from building a specialist profession',
    health: 'Wood element — watch the liver, gallbladder, and nervous system. Overthinking leads to insomnia; meditation and mindfulness are strongly recommended',
  },
  '太阳': {
    niHaixia: 'Ni Haixia sees Tai Yang as the masculine, patriarchal star — bright and upright from Mao to Wu, fading thereafter. Those with Tai Yang in the Life Palace are generous and image-conscious; excellent for men, but too dominant for women. Tai Yang represents the father and elders. In the Life Palace it produces an outgoing, cheerful nature that loves public attention — best in civil service or public-facing careers. In dim positions the native starts industrious but gradually grows lazy and isolated.',
    classical: 'Classical maxim: "Tai Yang in Wu palace shines at full power — noble and prominent, best for men; in dim positions: solitary toil, diligent then lazy." Nanbeishanren notes: "Tai Yang in Wu palace brings wealth and career in harmony; in Chen palace these peak in middle age; those born in Yi years benefit even in adverse aspects."',
    bestPalace: 'Life Palace (Mao to Wu), Career Palace',
    worstPalace: 'Spouse Palace (female chart), Health Palace',
    career: 'Civil service, politics, management, PR, education, media — loves being in the spotlight, ideal for public-facing careers',
    relationship: 'Men: good romantic prospects but attention-scattered; women: independent and assertive — marriage needs adjustment; best paired with a gentle, attentive partner',
    wealth: 'Wealth comes through effort; generous by nature and poor at saving; bright placement brings strong fortune, dim placement brings ups and downs',
    health: 'Fire element — watch the heart and eyes. Dim positions lead to overwork; ample rest is essential',
  },
  '武曲': {
    niHaixia: 'Ni Haixia regards Wu Qu as the primary wealth star — rigid and unyielding, most afraid of solitary hardship. Those with it in the Life Palace have iron will and excel in finance, but are blunt in relationships and can easily wound others. Wu Qu Hua Ji calls for caution around accidents and bleeding injuries. Wu Qu is strongest in Chen, Xu, Chou, and Wei — paired with Qi Sha it forms the "General Wealth" pattern, one of the finest wealth configurations.',
    classical: 'Classical maxim: "Wu Qu is metal, unyielding by nature — a life of hardship and clashes; in a bright position it commands armies and courts." Nanbeishanren notes: "Wu Qu in the Life Palace with auspicious three-direction and four-cardinal aspects brings wealth and career in harmony; with Zuo Fu, You Bi, Wen Chang, or Wen Qu it reaches great nobility; paired with Qi Sha it forms the General Wealth pattern — great riches."',
    bestPalace: 'Life Palace (Chen/Xu/Chou/Wei), Wealth Palace, Career Palace',
    worstPalace: 'Spouse Palace',
    career: 'Finance, military/police, accounting, engineering — exceptionally strong execution, best in fields requiring boldness and decisive judgment',
    relationship: 'Straightforward in love, lacking in romance — needs a gentle partner to complement; avoid configurations that isolate emotionally',
    wealth: 'Born as the wealth star — financial fortune is exceptionally strong and money management is superb; Chen/Xu placement brings wealth and career together',
    health: 'Metal element — watch the lungs, respiratory system, and teeth. When Hua Ji is active, take extra precautions against accidents and injuries',
  },
  '天同': {
    niHaixia: 'Ni Haixia calls Tian Tong the Blessing Star — the laziest of all stars. Those born with it in the Life Palace love comfort and dislike competition; stable jobs suit them best. Tian Tong paired with Tian Liang is ideal — blessings plus security. Tian Tong Hua Lu is the most beautiful transformation: a lifetime free from want, drifting happily. Beware dim positions, which diminish the blessings and require auspicious stars to compensate.',
    classical: 'Classical maxim: "Tian Tong is the star of blessing and virtue — in the Life Palace the native enjoys comfort freely, living a carefree life without hardship." Nanbeishanren notes: "Tian Tong in the Life Palace with no sha stars in the three directions brings lifelong happiness and plenty of food and clothing; with auspicious stars it yields both wealth and status — a warm personality with wide social appeal."',
    bestPalace: 'Life Palace, Spirit Palace',
    worstPalace: 'Career Palace',
    career: 'Hospitality, entertainment, food and beverage, arts — thrives in relaxed and pleasant environments; avoid high-pressure competition',
    relationship: 'Gentle in love, not the pursuer — tends to accept what comes; marriage is fairly stable; warm and easy-going personality draws people in',
    wealth: 'Wealth is not exceptional — depends on a steady salary and avoids speculation; comfortable but rarely accumulates great riches',
    health: 'Water element — watch the kidneys and bladder. Constitution is relatively weak; moderate exercise and maintaining a relaxed mindset are essential',
  },
  '廉贞': {
    niHaixia: 'Ni Haixia sees Lian Zhen as the secondary peach-blossom star — brimming with talent but romantically complicated. Lian Zhen Hua Ji is very severe, representing lawsuits, imprisonment, and accidents. Paired with Tian Xiang it transforms adversity into auspice, forming the administrative-seal pattern. Lian Zhen is fire element with a fierce temperament — a life of ups and downs, exceptional talent; if channeled with integrity, great achievement is possible.',
    classical: 'Classical maxim: "Lian Zhen is the secondary peach blossom — abundant talent, turbulent romance; paired with Tian Xiang it transforms harm into auspice, forming the administrative-seal pattern, granting authority." Nanbeishanren notes: "Lian Zhen in the Life Palace with auspicious stars produces outstanding talent; with Hua Ji it brings entangling lawsuits and the risk of injuries — beware."',
    bestPalace: 'Career Palace (paired with Tian Xiang), Life Palace (when Hua Lu)',
    worstPalace: 'Life Palace (when Hua Ji), Spouse Palace',
    career: 'Arts, entertainment, law, civil service (paired with Tian Xiang) — exceptional talent; staying on a legitimate path is key to longevity',
    relationship: 'Heavy peach-blossom influence — romantic life is complex and prone to disputes; marrying later with a steady partner is advisable',
    wealth: 'Fluctuating wealth, earned through talent and skill; when Hua Ji is active, guard against financial disputes and legal risks',
    health: 'Fire element — watch the heart, blood, and liver. When Hua Ji is active, guard against accidents and surgery; pay attention to the risk of injuries',
  },
  '天府': {
    niHaixia: 'Ni Haixia calls Tian Fu the Wealth Vault Star — a preservation star that does not actively generate wealth but can hold it. Those with it in the Life Palace are steady and conservative; best for women, who can prosper the household. Tian Fu loves to pair with or face Zi Wei, forming a double-star pattern of wealth and career. It fears being flanked by Di Kong and Di Jie — when those appear, the vault leaks and wealth cannot be held.',
    classical: 'Classical maxim: "Tian Fu, the vault star, makes the native steady and conservative — accumulates wealth and prospers the home; women who have it can elevate their husband and raise fine children, bringing the family to flourish." Nanbeishanren notes: "Tian Fu in the Life Palace with auspicious three-direction stars brings wealth and career in harmony, richness and health; if Di Kong or Di Jie appear, the vault cracks and wealth cannot accumulate."',
    bestPalace: 'Life Palace, Wealth Palace, Property Palace',
    worstPalace: 'Travel Palace',
    career: 'Administrative management, finance, insurance, real estate — prioritizes stability over risk; best in preservation-oriented careers',
    relationship: 'Stable and family-oriented in love — a reliable partner; values the security of home and financial protection',
    wealth: 'Excellent wealth fortune with strong saving ability; best suited for accumulation-style investment and property acquisition',
    health: 'Earth element — watch the spleen, stomach, and digestion. Constitution is robust; maintain a regular diet and lifestyle',
  },
  '太阴': {
    niHaixia: 'Ni Haixia views Tai Yin as the wealth star, favorable for women, and the representative star of the mother and wife in a man\'s chart. In bright positions wealth is exceptional; in dim positions wealth is blocked. Tai Yin Hua Ji calls for attention to issues with female relatives. Tai Yin shines brightest in Hai and Zi, radiating full light — representing elegance, sensitivity, emotional richness, and a strong inner life.',
    classical: 'Classical maxim: "Tai Yin is the wealth star, favorable for women; in Hai or Zi it shines at full power with exceptional fortune; in Wu it falls — melancholic and sentimental, wealth is flat." Nanbeishanren notes: "Tai Yin in the Life Palace shines brilliantly in its bright positions, wealth is abundant and women especially benefit; in dim positions the native must work hard to become wealthy — emotions run deep."',
    bestPalace: 'Life Palace (Hai/Zi), Wealth Palace',
    worstPalace: 'Life Palace (Wu — dim position)',
    career: 'Finance, real estate, arts, education — meticulous and patient; best in professions that call for aesthetic sensibility and gentleness',
    relationship: 'Tender and perceptive in love; inner feelings are paramount — needs a stable, secure relationship',
    wealth: 'Brilliant wealth fortune in bright positions; dim positions require effort; meticulous with money, good at accumulation, avoids speculation',
    health: 'Water element — watch the kidneys and uterus (women). Emotional swings affect health; maintaining a cheerful mood is essential',
  },
  '贪狼': {
    niHaixia: 'Ni Haixia says Tan Lang is the most versatile and multi-talented star, with the heaviest peach-blossom energy. Tan Lang Hua Lu in the Life Palace radiates charisma and universal appeal. Tan Lang is a late-bloomer — true success comes after middle age. It shines brightest in Yin and Shen, where talent and romantic energy peak; Hua Lu brings great wealth, but Di Kong or Di Jie create a lifetime of instability and difficulty accumulating money.',
    classical: 'Classical maxim: "Tan Lang brings prosperity and versatility, with the heaviest romantic influence — yet many struggle before thirty; late bloomers abound. In dim positions meeting sha stars can paradoxically bring good fortune — this is the principle of Tan Lang in decline." Nanbeishanren notes: "Tan Lang in the Life Palace with auspicious stars brings blessing, wealth, and longevity; but prolonged good fortune may not end well — cultivating virtue is advised for a good ending."',
    bestPalace: 'Life Palace (Hua Lu), Spirit Palace, Travel Palace',
    worstPalace: 'Health Palace',
    career: 'Arts, entertainment, PR, sales, divination arts — thrives on connections and talent; the archetypal multi-talented professional',
    relationship: 'Intense romantic energy and diverse attractions; better to marry later; after marriage, channeling the peach-blossom energy into fidelity is key to lasting happiness',
    wealth: 'Earns through connections and talent; wealth stabilizes in middle to late years; Hua Lu opens wide income channels — in early years, caution and steadiness are best',
    health: 'Wood element (with a water component) — watch the liver and kidneys. Excessive romantic energy depletes vitality; moderation and restorative practices are important',
  },
  '巨门': {
    niHaixia: 'Ni Haixia sees Ju Men as the star of disputes and gossip, but with Hua Lu or Hua Quan it transforms into a pattern of earning through eloquence. Those with Ju Men in the Life Palace are suspicious and argumentative — ideal for law, teaching, and sales. Ju Men fears Hua Ji most of all: endless disputes that may escalate to litigation. Ju Men is best in Zi or Wu, where verbal talent is strongest and the native makes a living through words.',
    classical: 'Classical maxim: "Ju Men is a dark luminary, governing disputes and gossip; with Hua Lu or Hua Quan it transforms into earning a living through eloquence — wealth and status follow." Nanbeishanren notes: "Ju Men in the Life Palace with Hua Lu or Hua Quan is greatly auspicious for those who earn through speaking; with Hua Ji gossip entangles and lawsuits bind — guard your words carefully."',
    bestPalace: 'Career Palace (Hua Lu/Quan), Life Palace (Zi/Wu)',
    worstPalace: 'Spouse Palace, Health Palace (when Hua Ji)',
    career: 'Lawyer, teacher, sales, host/presenter, negotiator — verbal skill is the core competitive advantage',
    relationship: 'Suspicious and over-thinking — communication is the make-or-break of marriage; a patient partner is essential',
    wealth: 'Earns through eloquence and specialist skills; Hua Lu improves financial fortune considerably; Hua Ji brings financial disputes and reputational damage from gossip — guard against both',
    health: 'Water element — watch the kidneys, ears, and oral cavity. Overthinking wears the body down; learning to relax and decompress is important',
  },
  '天相': {
    niHaixia: 'Ni Haixia describes Tian Xiang as the Seal Star, responsible for administration and routine affairs. Those with it in the Life Palace are rule-abiding and well-suited to public service. Tian Xiang needs a strong star as companion to shine — on its own in the Life Palace it is unremarkable. It loves Lian Zhen as a companion, forming the Lian-Xiang pattern of administrative authority; it fears Po Jun in the same palace, forming the Xing-Ji-Jia-Yin (punishing restraint flanking the seal) pattern — a sign of grave danger.',
    classical: 'Classical maxim: "Tian Xiang, the seal star, governs administrative duties; paired with Lian Zhen it transforms adversity into auspice and commands administrative authority." Nanbeishanren notes: "Tian Xiang in the Life Palace is measured and rule-abiding — fit for public office; paired with Lian Zhen it can become a pillar of the state; with Po Jun co-residing, clashes and setbacks are unavoidable."',
    bestPalace: 'Career Palace, Life Palace (paired with Lian Zhen)',
    worstPalace: 'Wealth Palace, Life Palace (with Po Jun — the Xing-Ji-Jia-Yin pattern)',
    career: 'Civil service, administration, secretary, assistant — excels in supportive roles; needs a stronger star to provide direction',
    relationship: 'Stable, loyal, and honest in love — a good partner, but needs the other person to take the lead',
    wealth: 'Steady financial fortune, accumulated through a salary; not suited to speculative investment — conservative wealth management is best',
    health: 'Water element — watch the kidneys and lymphatic system. Constitution is average; maintaining a regular lifestyle routine is important',
  },
  '天梁': {
    niHaixia: 'Ni Haixia regards Tian Liang as the Shelter Star — it can protect others and also represents medicine and religion. Those with it in the Life Palace have an affinity with elders; early life brings many trials, but the later years are peaceful and blessed. Tian Liang fears Hua Ji most — it signals trouble with elders or health problems. Tian Liang is best paired with Tai Yang: sun and moon shining together, sheltered by benefactors, a lifetime of benefactor support, and ultimate peace.',
    classical: 'Classical maxim: "Tian Liang is the shelter star, governing protection — those with it in the Life Palace have strong elder connections; early years are tested, later years bring quiet fortune." Nanbeishanren notes: "Tian Liang in the Life Palace must meet auspicious stars to prosper; with Tai Yang co-residing, sun and moon shine together — nobility and prominence follow, with benefactors throughout life."',
    bestPalace: 'Life Palace, Parents Palace, Spirit Palace',
    worstPalace: 'Life Palace (when Hua Ji), Wealth Palace',
    career: 'Medicine, religion, law, social work, charity — loves helping others and sheltering the wider community',
    relationship: 'Romantic connections often involve a significant age gap, or love arrives late — patience and waiting are rewarded',
    wealth: 'Wealth depends on benefactors; early fortune is modest — stability comes in later years; hold steady rather than push aggressively',
    health: 'Earth element — watch the spleen, stomach, and bones. Pay special attention to health as one ages; preventive care should begin early',
  },
  '七杀': {
    niHaixia: 'Ni Haixia calls Qi Sha the General Star — decisiveness and drive are its hallmarks, but solitary hardship is its shadow. Qi Sha in the Life Palace absolutely needs support stars to soften its isolating tendency, or family bonds will be thin. Paired with Wu Qu it forms the General Wealth pattern — one of the finest. It fears the Bamboo-Basket Triple Limit (Qing Yang, Tuo Luo, Huo Xing, and Ling Xing all shining together) — a very inauspicious configuration; guard against accidents. With Hua Lu it reverses to auspice and the native can become a great commander.',
    classical: 'Classical maxim: "Qi Sha is the General Star — decisiveness and drive are strong; in the Life Palace its solitary nature is heavy and family ties are thin." Nanbeishanren notes: "Qi Sha in the Life Palace with auspicious three-direction stars brings great nobility; meeting the Bamboo-Basket Triple Limit (Yang, Tuo, Huo, Ling) brings grave misfortune — guard against accidents and clashes."',
    bestPalace: 'Life Palace (with support stars), Career Palace',
    worstPalace: 'Spouse Palace, Parents Palace',
    career: 'Military/police, entrepreneurship, financial trading, solo command roles — rapid decision-making and boldness are essential',
    relationship: 'Solitary in love — finding a compatible partner is difficult; needs someone who can accept a dominant personality; marrying later is advisable',
    wealth: 'Highly volatile wealth — potential for great riches but also dramatic swings; paired with Wu Qu the General Wealth pattern produces great prosperity',
    health: 'Metal element — watch the lungs and large intestine. An impatient temperament harms the body; learning emotional control and self-cultivation is essential',
  },
  '破军': {
    niHaixia: 'Ni Haixia says Po Jun is the supreme star of breaking and rebuilding, and one of the most isolating. It only turns favorable with Hua Lu — representing the capacity to destroy and then rebuild. Po Jun in the Life Palace thins family bonds but supercharges pioneering ability. It is perfectly suited to reform and innovation; Hua Lu turns the financial tide — break, then build, and eventually career achievement follows.',
    classical: 'Classical maxim: "Po Jun is the ultimate star of breaking and rebuilding — in the Life Palace its solitary nature is strong and family bonds are thin, yet its pioneering power is unmatched; Hua Lu brings the break-then-build pattern that achieves great things." Nanbeishanren notes: "Po Jun in the Life Palace brings a life of many upheavals; with Hua Lu the native rebuilds after financial loss — fortune ultimately improves, with achievements in the later years."',
    bestPalace: 'Career Palace (Hua Lu), Travel Palace',
    worstPalace: 'Spouse Palace, Parents Palace',
    career: 'Pioneering ventures, military/police, reform, change management — ideal for trailblazing roles that continuously break into new territory',
    relationship: 'Turbulent and unstable romantic life; family bonds are thin — best matched with an independent partner who has a high tolerance for change',
    wealth: 'Highly volatile wealth; Hua Lu turns the tide — preserving what you have leads to decline; constant pioneering is needed to accumulate',
    health: 'Water element — watch the kidneys, bladder, and reproductive system. Constitution fluctuates; maintaining a regular exercise routine is important',
  },
};

const levelConfig = {
  major: { label: 'Major', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Lucky', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sha', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Minor', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* Header bar */}
          {/* Thanh tiêu đề */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{star.name}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  化{star.siHua}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* Basic info */}
            {/* Thông tin cơ bản */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Element: ${desc.element}`,
                  `Nature: ${desc.nature}`,
                  ...(palaceName ? [`Palace: ${palaceName}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Bright (Miao/Wang)' : star.brightness === 'dim' ? 'Dim (Xian)' : 'Neutral'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Bright') ? '#eab308' : tag.includes('Dim') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Keywords */}
            {/* Từ khóa */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Star Traits</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Classical texts */}
            {/* Cổ văn kinh điển */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  Classical Texts
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* Ni Haixia reading */}
            {/* Luận giải của Nghê Hải Hạ */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Ni Haixia's Reading
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Career', value: detail.career, icon: '◈' },
                    { label: 'Relationships', value: detail.relationship, icon: '♡' },
                    { label: 'Wealth', value: detail.wealth, icon: '◆' },
                    { label: 'Health', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Best Palace</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Caution Palace</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* Support/Sha star description */}
            {/* Mô tả sao phụ tinh/sát tinh */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === '文昌' && 'Wen Chang enters the palace — academics and examinations go smoothly, documents and seals are favorable; writing-related careers are recommended. Classical maxim: "Wen Chang in the imperial exam pattern — literary fame flourishes and every exam is passed."'}
                    {star.name === '文曲' && 'Wen Qu enters the palace — talent and artistry stand out, eloquence and expressiveness are excellent, artistic gifts are strong. Classical maxim: "Wen Qu is the star of talent — equally skilled in letters and martial arts, eloquence surpasses others."'}
                    {star.name === '左辅' && 'Zuo Fu enters the palace — benefactors offer assistance and mentorship; the matters of this palace receive helpful support. Classical maxim: "Zuo Fu is the star of support — in the Life Palace benefactors are plentiful and adversity is transformed into auspice."'}
                    {star.name === '右弼' && 'You Bi enters the palace — benefactors offer assistance, with a preponderance of female benefactors; the matters of this palace have helpers. Classical maxim: "You Bi is the star of hidden support — female benefactors are numerous and danger is turned to safety."'}
                    {star.name === '天魁' && 'Tian Kui enters the palace — the benefactor of those born in the daytime, predominantly male; adversity is transformed into auspice. Classical maxim: "Tian Kui is the Tian Yi Benefactor Star — wherever it appears, there is always someone to help."'}
                    {star.name === '天钺' && 'Tian Yue enters the palace — the benefactor of those born at night, predominantly female; auspicious energy is added. Classical maxim: "Tian Yue is the Jade Hall Benefactor Star — it governs hidden support and female benefactors are plentiful."'}
                    {star.name === '禄存' && 'Lu Cun enters the palace — wealth and fortune are preserved; this palace has financial energy, but of a conservative, steady kind. Classical maxim: "Lu Cun is the star of wealth and prosperity — wealth is easily held and income is steady and secure."'}
                    {star.name === '天马' && 'Tian Ma enters the palace — movement and bustling activity; wealth is found in motion, not waiting. Classical maxim: "Tian Ma governs movement — when paired with Lu the native enjoys full wealth and prosperity, generating income through action."'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === '地空' && 'Di Kong enters the palace — matters of this palace have a hollow, empty quality; mental energy scatters. Classical maxim: "Di Kong governs void and depletion — in the Life Palace the native is often spiritually adrift; guard against empty fantasizing."'}
                    {star.name === '地劫' && 'Di Jie enters the palace — unexpected losses threaten the matters of this palace; be careful with valuables and guard against petty people. Classical maxim: "Di Jie governs plunder — in the Life Palace financial fortune is damaged; guard against unexpected loss."'}
                    {star.name === '火星' && 'Huo Xing enters the palace — matters of this palace tend toward impulsiveness and emotional volatility, but when paired with Tan Lang it reverses to auspice. Classical maxim: "Huo Xing governs rashness — yet co-residing with Tan Lang it forms the Fire-Wolf pattern, which governs sudden explosive wealth."'}
                    {star.name === '铃星' && 'Ling Xing enters the palace — hidden obstacles threaten the matters of this palace; guard against backstabbing and keep a low profile. Classical maxim: "Ling Xing governs hidden sha energy — in the Life Palace the native often faces covert enemies; guard against behind-the-scenes disputes."'}
                    {star.name === '擎羊' && 'Qing Yang enters the palace — clashes and punishing energy; the matters of this palace are turbulent with a risk of injury or accident. Classical maxim: "Qing Yang is the star of clashes and punishment — in the Life Palace conflicts are frequent; guard against accidents and injuries."'}
                    {star.name === '陀罗' && 'Tuo Luo enters the palace — disputes cling and matters drag on; prepare early for everything. Classical maxim: "Tuo Luo governs lingering disputes and delays — in the Life Palace the native moves slowly and must guard against being entangled in unresolvable conflicts."'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
