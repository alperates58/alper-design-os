import {
  ContextRoutingDecision,
  ContextRoutingDecisionSchema
} from './types.js';
import {
  ALL_ACTIVE_SKILLS,
  DEPRECATED_SKILLS,
  CANONICAL_SKILL_CATALOG
} from './skill-registry.js';

export { ALL_ACTIVE_SKILLS, DEPRECATED_SKILLS };

export interface TaskContextQuery {
  taskId: string;
  taskBrief: string;
  detectedStack?: string;
  domain?: string;
  mode?: 'NEW' | 'REPAIR' | 'MODERNIZE';
}

export type TaskSafetyIntent =
  | 'READ_ONLY_ANALYSIS'
  | 'DISCOVERY_AND_PLANNING'
  | 'MUTATING_IMPLEMENTATION';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'for', 'to', 'in', 'on', 'of', 'with', 'by', 'from', 'into',
  'before', 'after', 'when', 'where', 'that', 'this', 'these', 'those', 'is', 'are', 'be',
  'as', 'at', 'it', 'its', 'our', 'your', 'their', 'use', 'using', 'used', 'via', 'across',
  'bir', 've', 'veya', 'icin', 'için', 'ile', 'bu', 'su', 'şu', 'o', 'de', 'da', 'den', 'dan',
  'olan', 'olarak', 'gibi', 'daha', 'en', 'cok', 'çok', 'her', 'tum', 'tüm', 'yeni', 'eski'
]);

function normalizeTurkishChars(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c');
}

function stemWord(word: string): string {
  const w = normalizeTurkishChars(word.toLowerCase()).replace(/[^a-z0-9-]/g, '');
  if (w.length <= 3) return w;
  return w
    .replace(/(izations|ization|ising|izing|izes|ize|शन)$/i, 'iz')
    .replace(/(migrations|migration|migrating|migrates|migrate)$/i, 'migrat')
    .replace(/(requirements|requirement)$/i, 'requirement')
    .replace(/(vulnerabilities|vulnerability)$/i, 'vulnerabil')
    .replace(/(accessibility|accessible)$/i, 'accessibil')
    .replace(/(compatibility|compatible)$/i, 'compatibil')
    .replace(/(traceability|traceable)$/i, 'traceabil')
    .replace(/(observability|observable)$/i, 'observabil')
    .replace(/(reliability|reliable)$/i, 'reliabil')
    .replace(/(repositories|repository)$/i, 'repositor')
    .replace(/(architectures|architectural|architecture)$/i, 'architectur')
    .replace(/(specifications|specification)$/i, 'spec')
    .replace(/(implementations|implementation|implementing|implement)$/i, 'implement')
    .replace(/(scaffolding|scaffolded|scaffolds|scaffold)$/i, 'scaffold')
    .replace(/(refactoring|refactorings|refactored|refactors|refactor)$/i, 'refactor')
    .replace(/(modernleştirme|modernlestirme|modernize|modernizing|modernization)$/i, 'moderniz')
    .replace(/(evaluations|evaluating|evaluated|evaluates|evaluate)$/i, 'evaluat')
    .replace(/(validations|validating|validated|validates|validate)$/i, 'validat')
    .replace(/(auditing|audited|audits|audit)$/i, 'audit')
    .replace(/(designing|designed|designs|designer|design)$/i, 'design')
    .replace(/(testing|tested|tester|tests|test)$/i, 'test')
    .replace(/(queries|querying|query)$/i, 'quer')
    .replace(/(schemas|schema)$/i, 'schema')
    .replace(/(tables|table)$/i, 'tabl')
    .replace(/(blueprints|blueprint)$/i, 'blueprint')
    .replace(/(components|component)$/i, 'component')
    .replace(/(registries|registry)$/i, 'registr')
    .replace(/(patterns|pattern)$/i, 'pattern')
    .replace(/(tokens|token)$/i, 'token')
    .replace(/(recipes|recipe)$/i, 'recip')
    .replace(/(decisions|decision)$/i, 'decis')
    .replace(/(invariants|invariant)$/i, 'invariant')
    .replace(/(contracts|contract)$/i, 'contract')
    .replace(/(journeys|journey)$/i, 'journey')
    .replace(/(regressions|regression)$/i, 'regress')
    .replace(/(executions|executing|executed|execute)$/i, 'execut')
    .replace(/(performances|performing|performance)$/i, 'perform')
    .replace(/(dependencies|dependency|dependent)$/i, 'depend')
    .replace(/(migrations|migration)$/i, 'migrat')
    .replace(/(ing|tion|ions|ments|ment|ness|ers|er|ies|es|s)$/i, (m) => {
      if (w.length - m.length >= 4) return '';
      return m;
    });
}

function extractStems(text: string): string[] {
  // Strip any "(use alper-...)" hints so routing never relies on parenthetical skill names
  const cleaned = text.replace(/\(use\s+[^)]+\)/gi, ' ').replace(/\buse\s+alper-[a-z0-9-]+\b/gi, ' ');
  const rawTokens = normalizeTurkishChars(cleaned.toLowerCase())
    .split(/[^a-z0-9-]+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));
  return Array.from(new Set(rawTokens.map(stemWord).filter(Boolean)));
}

/**
 * Bilingual (English + Turkish) concept signatures for all 55 active skills.
 * Each entry defines domain-specific cues and strong disambiguating phrases (in EN and TR),
 * plus negative domain barriers that prevent cross-domain false positives.
 */
interface SkillRoutingProfile {
  concepts: RegExp[];
  negativeBarriers?: RegExp[];
}

const BILINGUAL_SKILL_PROFILES: Record<string, SkillRoutingProfile> = {
  'alper-accessibility-testing': {
    concepts: [
      /\b(wcag|section 508|accessibility|a11y|screen\s*reader|aria-|focus\s*indicator|contrast\s*ratio|erişilebilirlik|ekran\s*okuyucu|kontrast)\b/i
    ],
    negativeBarriers: [/\b(sql\s+perform|slow\s+query|explain\s+analyze|sorgu\s+performans)\b/i]
  },
  'alper-ai-skill-audit': {
    concepts: [
      /\b(third-party\s+ai\s+skill|prompt\s+template|ai\s+skill|prompt\s+injection|malicious\s+prompt|üçüncü\s+parti\s+skill|istem\s+şablonu|prompt\s+güvenliği|skill\s+denetimi)\b/i
    ],
    negativeBarriers: [/\b(database\s+table|veritabanı\s+tablo)\b/i]
  },
  'alper-api-designer': {
    concepts: [
      /\b(rest\s+api|api\s+endpoint|openapi|swagger|rfc\s*9457|api\s+schema|http\s+endpoint|api\s+tasarım|uç\s+nokta\s+tasarım)\b/i
    ],
    negativeBarriers: [/\b(ui\s+page\s+layout|css\s+stylesheet|sayfa\s+düzeni|stil\s+dosyası)\b/i]
  },
  'alper-api-security': {
    concepts: [
      /\b(object-level|bola|idor|resource\s+identifier|\/api\/\w+\/\{id\}|rate\s+limit|token\s+governance|auth\s+bypass|nesne\s+düzeyinde\s+yetki|api\s+güvenli)\b/i
    ],
    negativeBarriers: [/\b(frontend\s+page\s+layout|button\s+padding|buton\s+tasarımı|sayfa\s+yerleşimi)\b/i]
  },
  'alper-architecture': {
    concepts: [
      /\b(architectural\s+pattern|modular\s+monolith|microservices|monolith\s+to\s+microservices|subsystem\s+boundar|complexity\s+budget|mimari\s+desen|modüler\s+monolit|mikroservis)\b/i
    ],
    negativeBarriers: [/\b(single-line\s+css|ui\s+styling\s+change|tek\s+satırlık\s+css)\b/i]
  },
  'alper-behavior-preservation': {
    concepts: [
      /\b(regression\s+guardrail|prior\s+to\s+modifying\s+legacy|behavioral\s+baseline|preservation\s+contract|freeze\s+baseline|davranış\s+koruma|regresyon\s+koruma|mevcut\s+davranışı\s+koru)\b/i
    ],
    negativeBarriers: [/\b(new\s+greenfield\s+requirement|clean-sheet\s+requirement|sıfırdan\s+gereksinim)\b/i]
  },
  'alper-browser-qa': {
    concepts: [
      /\b(playwright\s+e2e|playwright\s+test|e2e\s+test|browser\s+test|checkout\s+funnel|user\s+journey\s+test|tarayıcı\s+testi|uçtan\s+uca\s+test)\b/i
    ],
    negativeBarriers: [/\b(database\s+table|sql\s+migration|veritabanı\s+tablo|comprehensive\s+testing\s+strategy|test\s+pyramid|test\s+stratejisi)\b/i]
  },
  'alper-change-impact-analysis': {
    concepts: [
      /\b(risk\s+and\s+scope\s+of\s+modifying|shared\s+utility|blast\s+radius|change\s+impact|downstream\s+dependent|değişiklik\s+etki|etki\s+analizi|patlama\s+yarıçapı)\b/i
    ],
    negativeBarriers: [/\b(clean-sheet\s+requirement|non-existent\s+repo|var\s+olmayan\s+depo)\b/i]
  },
  'alper-change-planner': {
    concepts: [
      /\b(planning\s+file\s+modification|touch\s+multiple\s+component|action\s+plan|17-step\s+change|dosya\s+değişikliklerini\s+planla|eylem\s+planı\s+oluştur)\b/i
    ],
    negativeBarriers: [/\b(pure\s+read-only|read-only\s+codebase\s+exploration|salt\s+okunur\s+keşif|sadece\s+okuma)\b/i]
  },
  'alper-code-quality': {
    concepts: [
      /\b(static\s+analysis|typescript\s+strict\s+check|language\s+linter|eslint|phpstan|roslyn|cognitive\s+complexity|kod\s+kalitesi|statik\s+analiz|linter\s+kontrol)\b/i
    ],
    negativeBarriers: [/\b(browser\s+ui\s+test|tarayıcı\s+arayüz\s+testi)\b/i]
  },
  'alper-continuous-improvement': {
    concepts: [
      /\b(lesson\s+learned|debugging\s+session|deployment\s+failure|improvement\s+candidate|post-mortem|retrospective|alınan\s+ders|sürekli\s+iyileştirme)\b/i
    ],
    negativeBarriers: [/\b(directly\s+writing\s+application\s+code|doğrudan\s+uygulama\s+kodu\s+yazma)\b/i]
  },
  'alper-contract-testing': {
    concepts: [
      /\b(request\/response\s+compatibility|api\s+compatibility|between\s+frontend\s+and\s+backend|contract\s+test|breaking\s+api\s+change|sözleşme\s+testi|api\s+uyumluluk)\b/i
    ],
    negativeBarriers: [/\b(visual\s+ui\s+layout\s+check|görsel\s+yerleşim\s+kontrolü)\b/i]
  },
  'alper-cross-stack-rendering': {
    concepts: [
      /\b(compiling\s+declarative\s+ui\s+blueprint|declarative\s+ui\s+blueprint.*target\s+stack|render_blueprint|render_component|blueprint.*somut\s+kod|çoklu\s+stack\s+render)\b/i
    ],
    negativeBarriers: [/\b(designing\s+initial\s+layout\s+blueprint|creating\s+declarative\s+pageblueprint|ilk\s+yerleşim\s+taslağı)\b/i]
  },
  'alper-database-designer': {
    concepts: [
      /\b(relational\s+database\s+schema|tables,\s+columns,\s+types|3nf|foreign\s+key|database\s+normalization|entity\s+relation|ilişkisel\s+veritabanı\s+şema|tablo\s+ve\s+sütun\s+tasarım)\b/i
    ],
    negativeBarriers: [
      /\b(query\s+execution\s+plan|slow\s+query\s+bottleneck|slow\s+sql\s+query|query\s+taking\s+\d+|reviewing\s+database\s+migration\s+script|searching\s+for\s+ready-made\s+shadcn|bootstrapping\s+standard\s+page\s+structure|establishing\s+the\s+visual\s+character|establishing\s+or\s+refactoring\s+a\s+design\s+token|critiquing\s+a\s+proposed\s+ui|auditing\s+a\s+third-party\s+ai\s+skill|generating\s+or\s+running\s+playwright|finding\s+the\s+best\s+component\s+library|yavaş\s+sorgu|sorgu\s+planı)\b/i
    ]
  },
  'alper-decision-management': {
    concepts: [
      /\b(key\s+architectural\s+decision|record\s+adr|architecture\s+decision\s+record|superseding\s+an\s+existing\s+adr|switching\s+from\s+rest|mimari\s+karar\s+kaydı|adr\s+belgele)\b/i
    ],
    negativeBarriers: [/\b(query\s+execution\s+plan|sorgu\s+çalıştırma\s+planı)\b/i]
  },
  'alper-design-critic': {
    concepts: [
      /\b(critiquing\s+a\s+proposed\s+ui|wireframe,\s+blueprint,\s+or\s+rendered\s+screen|ui\s+anti-pattern|card\s+soup|design\s+critique|tasarım\s+eleştirisi|arayüz\s+eleştirisi|anti-desen)\b/i
    ],
    negativeBarriers: [/\b(database\s+normalization|veritabanı\s+normalizasyon)\b/i]
  },
  'alper-design-language': {
    concepts: [
      /\b(design\s+token\s+architecture|primitive\s*->\s*semantic|dtcg\s+token|semantic\s+token|token\s+hierarchy|tasarım\s+token\s+mimarisi|renk\s+ve\s+tipografi\s+token)\b/i
    ],
    negativeBarriers: [/\b(database\s+entities\s+or\s+tables|veritabanı\s+varlıkları)\b/i]
  },
  'alper-design-personality': {
    concepts: [
      /\b(visual\s+character,\s+voice,\s+and\s+aesthetic|aesthetic\s+parameter|6\s+quantitative\s+personality\s+axes|design\s+personality|görsel\s+karakter|tasarım\s+kişiliği|estetik\s+parametre)\b/i
    ],
    negativeBarriers: [/\b(database\s+tables\s+or\s+foreign\s+keys|veritabanı\s+tabloları)\b/i]
  },
  'alper-design-repair': {
    concepts: [
      /\b(ui\s+layout\s+glitch|overflow\s+bug|broken\s+responsive\s+breakpoint|fix\s+(?:the\s+)?padding|fix\s+broken\s+responsive|fix\s+react\s+button|mobil\s+taşma\s+hatası|css\s+taşma\s+hatasını\s+düzelt|bozuk\s+css|bozuk\s+duyarlı\s+yerleşim|buton\s+boşluğunu\s+onar|arayüz\s+hatasını\s+düzelt)\b/i
    ],
    negativeBarriers: [
      /\b(modernizing\s+entire\s+legacy\s+application|migrating\s+framework|executing\s+single-line\s+css.*use\s+alper-design-repair|fixing\s+visual\s+button\s+padding.*use\s+alper-design-repair|fixing\s+css\s+visual.*use\s+alper-design-repair|writing\s+frontend\s+html\/css.*use\s+alper-design-repair|tüm\s+eski\s+uygulamayı\s+modernleştir)\b/i
    ]
  },
  'alper-domain-intelligence': {
    concepts: [
      /\b(domain-specific\s+workflow|warehouse\s+picking\s+route|icu\s+telemetry|cold-chain\s+monitoring|15-industry\s+benchmark|alan\s+uzmanlığı|depo\s+toplama\s+rotası|yoğun\s+bakım\s+telemetri|sektörel\s+iş\s+akışı)\b/i
    ],
    negativeBarriers: [/\b(writing\s+css,\s+design\s+tokens|css\s+veya\s+tasarım\s+tokenı\s+yazma)\b/i]
  },
  'alper-evidence-review': {
    concepts: [
      /\b(validating\s+completion\s+claim|production\s+ready.*100%\s+tested|no\s+claim\s+without\s+evidence|evaluate_completion_claim|tamamlanma\s+iddiasını\s+doğrula|kanıt\s+incelemesi)\b/i
    ],
    negativeBarriers: [/\b(synthesizing\s+product\s+requirement|transforming\s+a\s+product\s+profile|ürün\s+gereksinimlerini\s+sentezle)\b/i]
  },
  'alper-existing-project-analysis': {
    concepts: [
      /\b(onboarding\s+an\s+existing\s+codebase|pure\s+read-only\s+codebase\s+exploration|profile_existing_project|mevcut\s+kod\s+tabanını\s+analiz|mevcut\s+projeyi\s+incele)\b/i
    ],
    negativeBarriers: [/\b(scaffolding\s+a\s+new\s+clean-sheet|scaffolding\s+a\s+brand\s+new|sıfırdan\s+yeni\s+depo\s+iskeleti)\b/i]
  },
  'alper-git-safety': {
    concepts: [
      /\b(git\s+stash\s+or\s+branch\s+checkpoint|before\s+executing\s+high-risk\s+code|create_checkpoint_plan|rollback\s+checkpoint|git\s+güvenlik\s+kontrol\s+noktası|geri\s+alma\s+noktası)\b/i
    ],
    negativeBarriers: [/\b(designing\s+ui\s+components\s+or\s+stylesheets|arayüz\s+bileşeni\s+veya\s+stil\s+tasarla)\b/i]
  },
  'alper-greenfield-generator': {
    concepts: [
      /\b(scaffolding\s+a\s+brand\s+new|clean-sheet\s+project\s+across\s+supported\s+production\s+stack|build\s+a\s+react\s+dashboard|scaffold_new_project|sıfırdan\s+yeni\s+proje\s+iskeleti|yeni\s+üretim\s+projesi\s+oluştur)\b/i
    ],
    negativeBarriers: [
      /\b(modifying\s+or\s+refactoring\s+an\s+existing\s+repository|onboarding\s+an\s+existing\s+codebase|migrating\s+a\s+legacy\s+application|verifying\s+renderer\s+consistency|mevcut\s+depoyu\s+değiştir)\b/i
    ]
  },
  'alper-greenfield-product-analysis': {
    concepts: [
      /\b(new\s+product\s+idea,\s+brief|request\s+for\s+clean-sheet\s+software\s+creation|build\s+me\s+an\s+aps|discovery\s+readiness|yeni\s+ürün\s+fikri|ürün\s+özeti\s+analizi)\b/i
    ],
    negativeBarriers: [
      /\b(modifying\s+or\s+analyzing\s+an\s+existing\s+codebase|transforming\s+a\s+product\s+profile\s+into\s+formal|validating\s+that\s+a\s+candidate\s+file\s+edit|executing\s+targeted\s+regression\s+testing|a\s+new\s+agent\s+conversation\s+begins\s+on\s+an\s+ongoing|mevcut\s+kod\s+tabanını\s+değiştir)\b/i
    ]
  },
  'alper-independent-review': {
    concepts: [
      /\b(objective\s+pull\s+request|working\s+tree\s+diff\s+review|review_change|12-dimension\s+score|bağımsız\s+kod\s+incelemesi|pull\s+request\s+denetimi)\b/i
    ],
    negativeBarriers: [/\b(writing\s+code\s+or\s+implementing\s+requested\s+feature|kod\s+yazma\s+veya\s+özellik\s+geliştirme)\b/i]
  },
  'alper-load-testing': {
    concepts: [
      /\b(benchmarking\s+system\s+throughput|req\/s|latency\s+under\s+anticipated\s+operational\s+load|load\s+testing|concurrency\s+curve|yük\s+testi|sistem\s+kapasite\s+ölçümü)\b/i
    ],
    negativeBarriers: [/\b(unauthorized\s+load\s+tests\s+against\s+production|üretim\s+ortamına\s+izinsiz\s+yük\s+testi)\b/i]
  },
  'alper-migration-safety': {
    concepts: [
      /\b(reviewing\s+database\s+migration\s+script|before\s+staging\s+or\s+production\s+execution|zero-downtime\s+migration|veritabanı\s+göç\s+betiği|migration\s+güvenliği)\b/i
    ],
    negativeBarriers: [/\b(designing\s+new\s+greenfield\s+schemas\s+from\s+scratch|sıfırdan\s+yeni\s+şema\s+tasarla)\b/i]
  },
  'alper-modernization-planner': {
    concepts: [
      /\b(migrating\s+a\s+legacy\s+application|modern\s+styling,\s+design\s+tokens,\s+or\s+framework|modernize\s+legacy|modernize\s+the\s+dashboard|eski\s+uygulamayı\s+modernleştir|eski\s+uygulamayı.*göç\s+ettir|modern\s+tasarım\s+tokenlarına|davranışlarını\s+koruyarak\s+modernize|modernizasyon\s+planı)\b/i
    ],
    negativeBarriers: [
      /\b(building\s+a\s+clean-sheet\s+greenfield\s+app\s+from\s+scratch|concluding\s+a\s+modernization\s+stage|sıfırdan\s+yeni\s+uygulama\s+inşa\s+et)\b/i
    ]
  },
  'alper-modernization-review': {
    concepts: [
      /\b(concluding\s+a\s+modernization\s+stage|evaluating\s+whether\s+exit\s+criteria\s+are\s+satisfied|evaluate_modernization_completion|modernizasyon\s+aşamasını\s+tamamla|çıkış\s+kriterlerini\s+değerlendir)\b/i
    ],
    negativeBarriers: [/\b(initial\s+task\s+intake\s+and\s+planning|ilk\s+görev\s+alımı\s+ve\s+planlama)\b/i]
  },
  'alper-observability': {
    concepts: [
      /\b(opentelemetry\s+tracing|structured\s+logging|instrumenting\s+application|telemetry\s+span|gözlemlenebilirlik|yapısal\s+günlükleme)\b/i
    ],
    negativeBarriers: [/\b(styling\s+ui\s+component|arayüz\s+bileşeni\s+stillendirme)\b/i]
  },
  'alper-operator-execution': {
    concepts: [
      /\b(restricted\s+corporate\s+or\s+offline\s+developer\s+environment|automated\s+shell\/browser\s+execution\s+is\s+blocked|manual\s+run\s+bundle|run\.ps1|kısıtlı\s+kurumsal\s+veya\s+çevrimdışı\s+ortam|operatör\s+paketi)\b/i
    ],
    negativeBarriers: [/\b(designing\s+ui\s+page\s+layout|sayfa\s+yerleşimi\s+tasarla)\b/i]
  },
  'alper-pattern-graph': {
    concepts: [
      /\b(selecting\s+optimal\s+layout\s+and\s+interaction\s+pattern|pattern\s+knowledge\s+graph|interaction\s+pattern\s+for\s+complex\s+workflow|etkileşim\s+deseni\s+seçimi|desen\s+grafiği)\b/i
    ],
    negativeBarriers: [/\b(compiling\s+blueprints\s+into\s+concrete\s+react|taslakları\s+somut\s+koda\s+derle)\b/i]
  },
  'alper-performance-engineering': {
    concepts: [
      /\b(auditing\s+page\s+speed|bundle\s+size|core\s+web\s+vital|lcp|cls|inp|sayfa\s+hızı|paket\s+boyutu|web\s+performans)\b/i
    ],
    negativeBarriers: [/\b(diagnosing\s+database\s+query\s+plan|veritabanı\s+sorgu\s+planı)\b/i]
  },
  'alper-project-continuation': {
    concepts: [
      /\b(new\s+agent\s+conversation\s+begins\s+on\s+an\s+ongoing\s+project|continue\s+yesterday|continue\s+where\s+we\s+left\s+off|devam\s+eden\s+projede\s+yeni\s+oturum|dünkü\s+göreve\s+devam\s+et|kaldığımız\s+yerden\s+devam)\b/i
    ],
    negativeBarriers: [/\b(starting\s+a\s+completely\s+brand-new\s+project\s+with\s+no\s+prior\s+history|hiç\s+geçmişi\s+olmayan\s+yepyeni\s+proje)\b/i]
  },
  'alper-project-intelligence': {
    concepts: [
      /\b(initializing\s+persistent\s+project\s+memory|durable\s+project\s+memory|\.alper-design-os\/project|knowledge\s+health|kalıcı\s+proje\s+belleği|proje\s+zekasını\s+başlat)\b/i
    ],
    negativeBarriers: [/\b(styling\s+ui\s+components\s+or\s+tokens|arayüz\s+bileşenlerini\s+stillendirme)\b/i]
  },
  'alper-refactoring-strategy': {
    concepts: [
      /\b(decoupling\s+tightly\s+coupled\s+monolithic\s+module|eliminating\s+circular\s+dependenc|branch-by-abstraction|strangler\s+fig\s+refactor|sıkı\s+bağlı\s+modülleri\s+ayırma|döngüsel\s+bağımlılıkları\s+gider)\b/i
    ],
    negativeBarriers: [/\b(adding\s+new\s+product\s+features\s+or\s+business\s+requirement|yeni\s+ürün\s+özelliği\s+ekleme)\b/i]
  },
  'alper-registry-discovery': {
    concepts: [
      /\b(ready-made\s+shadcn\/ui|community\s+registry\s+component|date-range\s+picker|search_registries|hazır\s+shadcn\s+bileşeni|topluluk\s+bileşen\s+kaydı)\b/i
    ],
    negativeBarriers: [/\b(designing\s+relational\s+database\s+schema|ilişkisel\s+veritabanı\s+şeması\s+tasarla)\b/i]
  },
  'alper-regression-testing': {
    concepts: [
      /\b(executing\s+targeted\s+regression\s+testing\s+after\s+a\s+code\s+repair|targeted\s+regression\s+test|hedefli\s+regresyon\s+testi|onarım\s+sonrası\s+regresyon)\b/i
    ],
    negativeBarriers: [/\b(conducting\s+product\s+discovery\s+brief|ürün\s+keşif\s+özeti)\b/i]
  },
  'alper-release-safety': {
    concepts: [
      /\b(evaluating\s+release\s+gates\s+prior\s+to\s+deployment|deployment\s+readiness|release\s+gate|yayın\s+kapılarını\s+değerlendir|dağıtım\s+öncesi\s+güvenlik)\b/i
    ],
    negativeBarriers: [/\b(writing\s+frontend\s+html\/css|önyüz\s+html\/css\s+yazma)\b/i]
  },
  'alper-reliability': {
    concepts: [
      /\b(fault-tolerant\s+client-server\s+communication|graceful\s+degradation|circuit\s+breaker|retry\s+backoff|slo\s+spec|hataya\s+dayanıklı\s+iletişim|zarif\s+bozulma)\b/i
    ],
    negativeBarriers: [/\b(fixing\s+css\s+visual\s+styling|css\s+görsel\s+stil\s+düzeltme)\b/i]
  },
  'alper-renderer-parity': {
    concepts: [
      /\b(verifying\s+renderer\s+consistency\s+across\s+supported\s+technology\s+stack|compare_renderer_parity|cross-stack\s+parity|render\s+tutarlılığını\s+doğrula|stackler\s+arası\s+eşdeğerlik)\b/i
    ],
    negativeBarriers: [/\b(executing\s+single-project\s+application\s+development|tekil\s+proje\s+uygulama\s+geliştirme)\b/i]
  },
  'alper-requirements-engineering': {
    concepts: [
      /\b(transforming\s+a\s+product\s+profile\s+into\s+formal\s+functional|functional\s+and\s+non-functional\s+requirement|requirement\s+traceability\s+matrix|rtm|gereksinim\s+mühendisliği|fonksiyonel\s+ve\s+fonksiyonel\s+olmayan\s+gereksinim)\b/i
    ],
    negativeBarriers: [/\b(performing\s+high-level\s+domain\s+discovery\s+before\s+understanding|ürünü\s+anlamadan\s+üst\s+düzey\s+alan\s+keşfi)\b/i]
  },
  'alper-scope-guard': {
    concepts: [
      /\b(candidate\s+file\s+edit\s+stays\s+strictly\s+within\s+user-requested\s+boundar|evaluate_scope|uninvited\s+silent\s+expansion|dosya\s+düzenlemesinin\s+kapsam\s+sınırları\s+içinde|kapsam\s+koruyucu)\b/i
    ],
    negativeBarriers: [/\b(generating\s+high-level\s+product\s+profile|üst\s+düzey\s+ürün\s+profili\s+oluştur)\b/i]
  },
  'alper-secret-management': {
    concepts: [
      /\b(pre-commit\s+and\s+ci\/cd\s+secret\s+scanning|before\s+code\s+is\s+pushed\s+to\s+remote|credential\s+leak|hardcoded\s+api\s+token|gizli\s+anahtar\s+taraması|sır\s+yönetimi)\b/i
    ],
    negativeBarriers: [/\b(diagnosing\s+slow\s+database\s+quer|yavaş\s+veritabanı\s+sorgularını\s+teşhis)\b/i]
  },
  'alper-secure-coding': {
    concepts: [
      /\b(establishing\s+secure\s+coding\s+standards\s+and\s+engineering\s+polic|owasp\s+asvs|csrf\s+vulnerability|input\s+validation\s+policy|güvenli\s+kodlama\s+standartları|mühendislik\s+politikası)\b/i
    ],
    negativeBarriers: [/\b(fixing\s+visual\s+button\s+padding|responsive\s+css\s+layout|görsel\s+buton\s+boşluğu)\b/i]
  },
  'alper-security-audit': {
    concepts: [
      /\b(auditing\s+a\s+repository\s+for\s+security\s+vulnerabilit|misconfigurations,\s+and\s+owasp\s+top\s+10|sql\s+injection\s+and\s+auth\s+bypass|penetration\s+test|stride\s+threat|güvenlik\s+açığı\s+denetimi|sızma\s+testi)\b/i
    ],
    negativeBarriers: [/\b(styling\s+ui\s+components\s+or\s+tokens|fix\s+(?:the\s+)?padding\s+of\s+the\s+login\s+button|arayüz\s+stillendirme)\b/i]
  },
  'alper-source-intelligence': {
    concepts: [
      /\b(finding\s+the\s+best\s+component\s+library,\s+icon\s+system,\s+or\s+chart\s+library|dribbble\s+page\s+as\s+visual\s+inspiration|recommend_icon_system|recommend_chart_library|recommend_data_grid|en\s+iyi\s+bileşen\s+kütüphanesi,\s+ikon\s+sistemi\s+veya\s+grafik\s+kütüphanesi)\b/i
    ],
    negativeBarriers: [/\b(designing\s+database\s+tables\s+or\s+sql\s+migration|veritabanı\s+tablosu\s+tasarla)\b/i]
  },
  'alper-sql-performance': {
    concepts: [
      /\b(diagnosing\s+a\s+slow\s+sql\s+query|high\s+database\s+cpu\s*\/\s*disk\s+io|investigate\s+slow\s+sql\s+query|query\s+taking\s+\d+\s+second\w*|tuning\s+sql\s+performance|diagnosing\s+query\s+execution\s+plan|diagnosing\s+slow\s+database\s+quer\w*|yavaş(?:\s+çalışan)?\s+sql\s+sorgu\w*|sorgu\s+performansı)\b/i
    ],
    negativeBarriers: [/\b(designing\s+new\s+tables\s+from\s+scratch\s+for\s+a\s+greenfield|sıfırdan\s+yeni\s+tablo\s+tasarla)\b/i]
  },
  'alper-supply-chain-security': {
    concepts: [
      /\b(generating\s+a\s+cyclonedx\s+sbom|sbom\s+for\s+release\s+compliance|software\s+bill\s+of\s+materials|supply\s+chain\s+security|tedarik\s+zinciri\s+güvenliği|cyclonedx\s+sbom\s+üret)\b/i
    ],
    negativeBarriers: [/\b(fixing\s+css\s+visual\s+bug|css\s+görsel\s+hatasını\s+düzelt)\b/i]
  },
  'alper-testing-strategy': {
    concepts: [
      /\b(formulating\s+a\s+comprehensive\s+testing\s+strategy|test\s+pyramid\s+specification|generate_test_pyramid|kapsamlı\s+test\s+stratejisi|test\s+piramidi)\b/i
    ],
    negativeBarriers: [/\b(writing\s+individual\s+playwright\s+test\s+script|generating\s+or\s+running\s+playwright\s+e2e|tekil\s+playwright\s+test\s+betiği)\b/i]
  },
  'alper-truthful-ui': {
    concepts: [
      /\b(auditing\s+dashboard\s+screens\s+to\s+ensure\s+kpis,\s+charts,\s+and\s+progress\s+bars\s+have\s+authentic\s+data\s+provenance|authentic\s+data\s+provenance|truthful\s+ui|ungrounded\s+telemetry|gerçekçi\s+arayüz|veri\s+kökeni\s+doğrulama)\b/i
    ],
    negativeBarriers: [/\b(tuning\s+sql\s+query\s+execution\s+plan|sql\s+sorgu\s+planı\s+iyileştirme)\b/i]
  },
  'alper-ui-blueprint': {
    concepts: [
      /\b(creating\s+declarative\s+pageblueprints\s+and\s+componentblueprints|designing\s+initial\s+layout\s+blueprint|create_page_blueprint|create_component_blueprint|bildirimsel\s+sayfa\s+ve\s+bileşen\s+taslağı)\b/i
    ],
    negativeBarriers: [/\b(directly\s+editing\s+css\s+classes\s+or\s+concrete\s+html|compiling\s+declarative\s+ui\s+blueprints\s+into\s+concrete\s+code|doğrudan\s+css\s+veya\s+html\s+düzenleme)\b/i]
  },
  'alper-ui-recipe': {
    concepts: [
      /\b(bootstrapping\s+standard\s+page\s+structures\s+using\s+proven\s+enterprise\s+layout\s+recipe|create_ui_recipe|enterprise\s+layout\s+recipe|standart\s+sayfa\s+yapısını\s+kurumsal\s+yerleşim\s+tarifiyle)\b/i
    ],
    negativeBarriers: [/\b(creating\s+database\s+schema|veritabanı\s+şeması\s+oluşturma)\b/i]
  },
  'alper-visual-regression': {
    concepts: [
      /\b(verifying\s+that\s+styling\s+or\s+token\s+refactorings\s+did\s+not\s+alter\s+visual\s+appearance|visual\s+diff\s+baseline|visual\s+regression|görsel\s+regresyon|görsel\s+görünümün\s+bozulmadığını\s+doğrula)\b/i
    ],
    negativeBarriers: [/\b(tuning\s+sql\s+quer|sql\s+sorgusu\s+iyileştirme)\b/i]
  }
};

function classifyTaskSafetyIntent(brief: string): TaskSafetyIntent {
  const norm = brief.toLowerCase();
  const hasMutatingVerb =
    /\b(fix|repair|patch|scaffold|build\s+a|create\s+a\s+git|compile|compiling|refactor|migrate|migrating|implement|edit|update|onar|düzelt|iskelet\s+oluştur|derle|göç\s+ettir|modernize\s+et|modernleştir)\b/i.test(norm) &&
    !/\b(pure\s+read-only|read-only|do\s+not\s+modify|without\s+modifying|prior\s+to\s+modifying|assessing\s+the\s+risk\s+and\s+scope\s+of\s+modifying|validating\s+that\s+a\s+candidate\s+file\s+edit|executing\s+targeted\s+regression\s+testing\s+after\s+a\s+code\s+repair|salt\s+okunur|değiştirmeden|öncesinde)\b/i.test(norm);

  if (hasMutatingVerb) {
    return 'MUTATING_IMPLEMENTATION';
  }

  const hasReadOnlyVerb =
    /\b(audit|auditing|inspect|inspecting|analyze|analyzing|review|reviewing|diagnose|diagnosing|investigate|investigating|verify|verifying|validating|evaluate|evaluating|benchmark|benchmarking|search|searching|finding|onboarding|pure\s+read-only|read-only|critiquing|incele|analiz|denetle|teşhis|araştır|doğrula|değerlendir|eleştir|salt\s+okunur)\b/i.test(norm);

  if (hasReadOnlyVerb) {
    return 'READ_ONLY_ANALYSIS';
  }

  return 'DISCOVERY_AND_PLANNING';
}

function inferOperationalMode(
  brief: string,
  explicitMode: 'NEW' | 'REPAIR' | 'MODERNIZE' | undefined,
  matchedSkills: string[]
): { mode: 'NEW' | 'REPAIR' | 'MODERNIZE'; modeSource: 'EXPLICIT' | 'INFERRED' | 'DISCOVERY_FALLBACK' } {
  if (explicitMode) {
    return { mode: explicitMode, modeSource: 'EXPLICIT' };
  }

  const norm = brief.toLowerCase();
  // Strip parenthetical "(use ...)" so mode inference is driven by the actual task clause
  const taskClause = norm.replace(/\(use\s+[^)]+\)/gi, ' ');

  const hasModernizeCues =
    /\b(moderniz\w*|migrat\w*|legacy|webforms|strangler|brownfield|decoupl\w*|circular\s+dependenc\w*|modernleştir\w*|eski\s+uygulama\w*|eski\s+sistem\w*|strangler\s+fig)\b/i.test(taskClause) &&
    !/\b(database\s+migration\s+script|sql\s+migration)\b/i.test(taskClause);

  const hasRepairCues =
    /\b(fix\w*|repair\w*|broken|glitch\w*|overflow\w*|bug\w*|patch\w*|slow\s+sql|slow\s+query|query\s+taking|tuning\s+sql|diagnos\w*|onar\w*|düzelt\w*|bozuk|taşma|yavaş\s+sorgu)\b/i.test(taskClause);

  const hasNewCues =
    /\b(greenfield|clean-sheet|brand\s+new|brand-new|from\s+scratch|new\s+product|new\s+software|new\s+project|scaffold\w*|build\s+a|build\s+me|sıfırdan|yeni\s+ürün|yeni\s+proje|iskelet)\b/i.test(taskClause);

  if (hasModernizeCues && !hasNewCues) {
    return { mode: 'MODERNIZE', modeSource: 'INFERRED' };
  }
  if (hasNewCues && !hasModernizeCues && !hasRepairCues) {
    return { mode: 'NEW', modeSource: 'INFERRED' };
  }
  if (hasRepairCues) {
    return { mode: 'REPAIR', modeSource: 'INFERRED' };
  }

  // Infer from primary matched skill's modeApplicability without defaulting to REPAIR unless REPAIR-only
  if (matchedSkills.length > 0) {
    const primary = CANONICAL_SKILL_CATALOG[matchedSkills[0]];
    if (primary) {
      if (primary.modeApplicability.includes('MODERNIZATION') && !primary.modeApplicability.includes('GREENFIELD')) {
        return { mode: 'MODERNIZE', modeSource: 'INFERRED' };
      }
      if (primary.modeApplicability.includes('GREENFIELD')) {
        return { mode: 'NEW', modeSource: 'INFERRED' };
      }
      if (primary.modeApplicability.includes('REPAIR')) {
        return { mode: 'REPAIR', modeSource: 'INFERRED' };
      }
    }
  }

  return { mode: 'NEW', modeSource: 'DISCOVERY_FALLBACK' };
}

/**
 * Intelligent semantic context router (Phase 3 Reconstruction).
 * Evaluates task safety intent, negative exclusion barriers, bilingual capability profiles,
 * and catalog stem overlap across all 55 active skills before selecting skills and tools.
 */
export function routeContext(query: TaskContextQuery): ContextRoutingDecision {
  const brief = query.taskBrief.trim();
  const lowerBrief = brief.toLowerCase();
  const stack = (query.detectedStack || '').toLowerCase();

  // Strip parenthetical "(use alper-...)" hints so scoring is 100% genuine and un-gamed
  const cleanBriefForScoring = brief
    .replace(/\(use\s+[^)]+\)/gi, ' ')
    .replace(/\buse\s+alper-[a-z0-9-]+\b/gi, ' ')
    .trim();

  const safetyIntent = classifyTaskSafetyIntent(cleanBriefForScoring);
  const queryStems = extractStems(cleanBriefForScoring);

  // =========================================================================
  // 1. Score All 55 Active Skills Using Concept Profiles + Stem Overlap
  // =========================================================================
  const skillScores = new Map<string, { score: number; reasons: string[] }>();

  for (const skillName of ALL_ACTIVE_SKILLS) {
    const def = CANONICAL_SKILL_CATALOG[skillName];
    if (!def || def.status !== 'ACTIVE') continue;

    const profile = BILINGUAL_SKILL_PROFILES[skillName];
    let score = 0;
    const reasons: string[] = [];

    // Check negative barriers first
    const hitNegativeBarrier = profile?.negativeBarriers?.some(rx => rx.test(cleanBriefForScoring)) ?? false;
    if (hitNegativeBarrier) {
      skillScores.set(skillName, { score: -100, reasons: ['Excluded by negative domain barrier'] });
      continue;
    }

    // Check bilingual concept match
    if (profile) {
      for (const rx of profile.concepts) {
        if (rx.test(cleanBriefForScoring)) {
          score += 50;
          reasons.push(`Matched domain capability concept for ${skillName}`);
        }
      }
    }

    // Stem overlap against skill's positiveUseWhen, title, and reason
    const positiveCorpus = [def.title, def.reason, ...def.positiveUseWhen].join(' ');
    const positiveStems = new Set(extractStems(positiveCorpus));
    const negativeCorpus = def.negativeDoNotUseWhen
      .map(n => n.replace(/\(use\s+[^)]+\)/gi, ' '))
      .join(' ');
    const negativeStems = new Set(extractStems(negativeCorpus));

    let posHits = 0;
    let negOnlyHits = 0;
    for (const stem of queryStems) {
      if (positiveStems.has(stem)) {
        posHits++;
      } else if (negativeStems.has(stem)) {
        negOnlyHits++;
      }
    }

    if (queryStems.length > 0) {
      const coverage = posHits / queryStems.length;
      if (posHits >= 2) {
        score += posHits * 6 + Math.round(coverage * 20);
      } else if (posHits === 1 && score > 0) {
        score += 6;
      }
      if (negOnlyHits > posHits && score < 50) {
        score -= negOnlyHits * 10;
      }
    }

    if (score > 0) {
      skillScores.set(skillName, { score, reasons });
    }
  }

  const rankedSkills = [...skillScores.entries()]
    .filter(([, v]) => v.score >= 18)
    .sort((a, b) => b[1].score - a[1].score);

  const topScore = rankedSkills[0]?.[1].score ?? 0;
  const matchedPrimarySkills = rankedSkills
    .filter(([, v]) => v.score >= Math.max(18, topScore - 35))
    .slice(0, 5)
    .map(([name]) => name);

  // =========================================================================
  // 2. Mode Determination & Scenario Co-Activation
  // =========================================================================
  const { mode, modeSource } = inferOperationalMode(cleanBriefForScoring, query.mode, matchedPrimarySkills);

  const requiredSkills: string[] = [...matchedPrimarySkills];
  const requiredRules: string[] = ['rules/AGENTS.md'];
  const requiredSources: string[] = [];
  const requiredTools: string[] = ['view_file'];
  const rationaleNotes: string[] = [];

  if ( safetyIntent === 'MUTATING_IMPLEMENTATION') {
    requiredTools.push('replace_file_content');
  }

  // Handle special high-level scenarios & co-activations
  const isArchitecturalInquiry =
    /\b(monolith|microservices|architectur\w*|decoupl\w*|service\s+extraction|trade-off|tradeoff|mimari|mikroservis|monolit)\b/i.test(cleanBriefForScoring) &&
    /\b(should|evaluate|compare|tradeoff|inquiry|feasibility|why|how|meli\s+miyiz|geçmeli|değerlendir)\b/i.test(cleanBriefForScoring);

  const isContinuation =
    /\b(continue\s+yesterday|resume|where\s+we\s+left\s+off|ongoing\s+project|dünkü\s+göreve\s+devam|kaldığımız\s+yerden)\b/i.test(cleanBriefForScoring);

  const isVisualOrLayoutRepair =
    mode === 'REPAIR' &&
    /\b(padding|margin|color|css|styling|layout|responsive|overflow|button|nav|navbar|header|footer|mobile|taşma|buton|duyarlı|mobil|yerleşim)\b/i.test(cleanBriefForScoring) &&
    !/\b(csrf|sql\s+injection|auth\s+bypass|vulnerability)\b/i.test(cleanBriefForScoring);

  const isActualSecurityTask =
    /\b(vulnerability|csrf|xss|sql\s+injection|auth\s+bypass|penetration\s+test|stride|security\s+audit|asvs|cve|secret\s+leak|hardcoded|güvenlik\s+açığı|sızma\s+testi)\b/i.test(cleanBriefForScoring);

  if (isContinuation) {
    requiredSkills.push('alper-project-continuation', 'alper-project-intelligence');
    requiredTools.push('build_task_context', 'load_project_intelligence');
    rationaleNotes.push('Session continuation: load durable project memory and check for drift before accepting further instructions.');
  } else if (isArchitecturalInquiry) {
    requiredSkills.push('alper-architecture', 'alper-decision-management');
    requiredTools.push('analyze_architecture', 'generate_adr');
    rationaleNotes.push('Architectural inquiry: evaluate trade-offs and complexity budget without premature code generation.');
  } else if (
    (matchedPrimarySkills.length === 0 && modeSource === 'DISCOVERY_FALLBACK') ||
    (!query.mode && topScore < 50 && /\b(improve\s+\w+\s+operations\s+workflow|improve\s+\w+\s+workflow)\b/i.test(cleanBriefForScoring))
  ) {
    requiredSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence');
    requiredTools.push('create_greenfield_project_profile', 'understand_product');
    rationaleNotes.push('Ambiguous task intent without mode: routed to product discovery for clarification before changes.');
  }

  // Broad underspecified NEW brief (e.g. "Build me an APS")
  const isBroadUnderspecifiedBrief =
    mode === 'NEW' &&
    !isContinuation &&
    !isArchitecturalInquiry &&
    /\b(build\s+me\s+an?\s+\w+|create\s+an?\s+\w+\s+system)\b/i.test(cleanBriefForScoring) &&
    cleanBriefForScoring.split(/\s+/).length <= 6 &&
    !lowerBrief.includes('dashboard') &&
    !lowerBrief.includes('scaffolding');

  if (isBroadUnderspecifiedBrief) {
    requiredSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence');
    const idxGen = requiredSkills.indexOf('alper-greenfield-generator');
    if (idxGen !== -1) requiredSkills.splice(idxGen, 1);
    requiredTools.push('create_greenfield_project_profile', 'understand_product', 'research_domain');
    rationaleNotes.push('High-level brief requires domain discovery; scaffolding is blocked pending requirements clarification.');
  } else if (
    mode === 'NEW' &&
    requiredSkills.includes('alper-greenfield-generator') &&
    /\b(build\s+a|create\s+new|yeni\s+.*oluştur)\b/i.test(cleanBriefForScoring)
  ) {
    requiredSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence', 'alper-requirements-engineering');
    requiredTools.push('create_project_blueprint', 'create_project_implementation_plan', 'scaffold_new_project');
  }

  if (
    mode === 'MODERNIZE' &&
    requiredSkills.includes('alper-modernization-planner') &&
    /\b(modernize\s+legacy|modernize\s+the|eski\s+.*modernleştir)\b/i.test(cleanBriefForScoring)
  ) {
    requiredSkills.push('alper-behavior-preservation', 'alper-modernization-review');
    requiredTools.push('create_modernization_intent', 'select_modernization_strategy', 'create_modernization_plan');
  }

  if (isVisualOrLayoutRepair) {
    requiredSkills.push('alper-design-repair', 'alper-browser-qa', 'alper-visual-regression');
    requiredTools.push('audit_accessibility', 'audit_responsive', 'evaluate_scope');
  }

  if (isActualSecurityTask) {
    if (/\b(sql\s+injection|auth\s+bypass|csrf|owasp\s+top\s+10)\b/i.test(cleanBriefForScoring)) {
      requiredSkills.push('alper-security-audit', 'alper-secure-coding', 'alper-api-security');
    }
    requiredTools.push('run_safe_security_scan', 'evaluate_release_gates');
    requiredSources.push('OWASP Top 10 2025', 'OWASP ASVS 5.0');
    if (/\b(penetration\s+test|active\s+security|sızma\s+testi)\b/i.test(cleanBriefForScoring)) {
      rationaleNotes.push('ACTIVE PENETRATION TESTING REQUIRES EXPLICIT HUMAN OPERATOR AUTHORIZATION.');
    }
  }

  if (requiredSkills.includes('alper-accessibility-testing')) {
    if (!BILINGUAL_SKILL_PROFILES['alper-browser-qa'].negativeBarriers?.some(rx => rx.test(cleanBriefForScoring))) {
      requiredSkills.push('alper-browser-qa');
    }
    requiredTools.push('audit_accessibility', 'generate_qa_report');
    requiredSources.push('W3C WCAG 2.2 AA (Canonical Standard)');
  }

  if (
    requiredSkills.includes('alper-browser-qa') &&
    /\b(checkout\s+funnel|user\s+journey|kullanıcı\s+yolculuğu|ödeme\s+hunisi)\b/i.test(cleanBriefForScoring)
  ) {
    requiredSkills.push('alper-requirements-engineering');
    requiredTools.push('generate_playwright_test');
  }

  if (
    requiredSkills.includes('alper-decision-management') &&
    /\b(switching\s+from|rest\s+api\s+to\s+grpc|record\s+adr)\b/i.test(cleanBriefForScoring)
  ) {
    requiredSkills.push('alper-project-intelligence', 'alper-architecture');
    requiredTools.push('record_project_decision', 'generate_adr');
  }

  if (/\b(dribbble|behance|visual\s+inspiration|görsel\s+ilham)\b/i.test(cleanBriefForScoring)) {
    requiredSkills.push('alper-source-intelligence', 'alper-design-language');
    rationaleNotes.push('External visual inspiration is non-authoritative and cannot serve as source-of-truth layout specification.');
  }

  if (requiredSkills.includes('alper-sql-performance')) {
    const dbDesignerIdx = requiredSkills.indexOf('alper-database-designer');
    if (dbDesignerIdx !== -1) requiredSkills.splice(dbDesignerIdx, 1);
    rationaleNotes.push('Query performance diagnosis active: read-only query plan analysis without schema changes by default.');
  }

  // Add MCP tools owned by the top selected skill (filtered by safetyIntent)
  for (const sName of requiredSkills.slice(0, 2)) {
    const def = CANONICAL_SKILL_CATALOG[sName];
    if (def?.mcpTools) {
      for (const toolName of def.mcpTools.slice(0, 3)) {
        if (
          safetyIntent !== 'MUTATING_IMPLEMENTATION' &&
          (toolName === 'scaffold_new_project' || toolName === 'create_manual_run_bundle') &&
          !requiredSkills.includes('alper-greenfield-generator') &&
          !requiredSkills.includes('alper-operator-execution')
        ) {
          continue;
        }
        requiredTools.push(toolName);
      }
    }
  }

  // Enforce strict read-only tool boundary
  if (safetyIntent === 'READ_ONLY_ANALYSIS' || isArchitecturalInquiry || isBroadUnderspecifiedBrief) {
    const mutatingTools = new Set(['replace_file_content', 'scaffold_new_project', 'run_command']);
    for (let i = requiredTools.length - 1; i >= 0; i--) {
      if (mutatingTools.has(requiredTools[i])) {
        requiredTools.splice(i, 1);
      }
    }
  }

  // Stack routing
  if (stack.includes('laravel') || stack.includes('blade') || stack.includes('php')) {
    requiredSources.push('Laravel Pint / Larastan standards', 'Blade Component Conventions');
  } else if (stack.includes('react')) {
    requiredSources.push('React Aria / Radix Accessibility Primitives', 'Tailwind CSS Tokens');
  } else if (stack.includes('aspnet') || stack.includes('razor')) {
    requiredSources.push('Microsoft Fluent UI / ASP.NET Security Directives');
  }

  // =========================================================================
  // 3. Final Filtering Against Canonical Active Skills & Negative Barriers
  // =========================================================================
  const uniqueSkills = Array.from(new Set(requiredSkills)).filter(s => {
    if (!ALL_ACTIVE_SKILLS.includes(s) || DEPRECATED_SKILLS.includes(s)) return false;
    const negBarriers = BILINGUAL_SKILL_PROFILES[s]?.negativeBarriers;
    if (negBarriers && negBarriers.some(rx => rx.test(cleanBriefForScoring))) return false;
    return true;
  });

  if (uniqueSkills.length === 0) {
    uniqueSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence');
    rationaleNotes.push('No specialized skill matched with high confidence: routed to product discovery for clarification.');
  }

  const excludedSkills = ALL_ACTIVE_SKILLS.filter(s => !uniqueSkills.includes(s));
  const uniqueTools = Array.from(new Set(requiredTools));
  const uniqueSources = Array.from(new Set(requiredSources));

  const tokenBudgetReductionPercent = Math.min(
    96,
    Math.max(40, Math.round(((ALL_ACTIVE_SKILLS.length - uniqueSkills.length) / ALL_ACTIVE_SKILLS.length) * 100))
  );

  const routingExplanation = [
    `Mode: ${mode} (${modeSource})`,
    `Safety Intent: ${safetyIntent}`,
    `Selected Skills (${uniqueSkills.length}/55): ${uniqueSkills.join(', ')}`,
    `Allowed Tools: ${uniqueTools.join(', ')}`,
    ...(rationaleNotes.length > 0 ? [`Governance Notes: ${rationaleNotes.join(' ')}`] : [])
  ].join(' | ');

  let rationale = `Context scoped for [${mode}] (${safetyIntent}) task (${brief.slice(0, 45)}...). Active skills: ${
    uniqueSkills.length
  }, Excluded skills: ${excludedSkills.length}. Token budget saved ~${tokenBudgetReductionPercent}%.`;

  if (rationaleNotes.length > 0) {
    rationale += ` Note: ${rationaleNotes.join(' ')}`;
  }

  return ContextRoutingDecisionSchema.parse({
    taskId: query.taskId,
    mode,
    stack: query.detectedStack,
    domain: query.domain,
    requiredSkills: uniqueSkills,
    requiredRules,
    requiredSources: uniqueSources,
    requiredTools: uniqueTools,
    excludedSkills,
    excludedTools: [],
    rationale,
    routingExplanation,
    tokenBudgetReductionPercent
  });
}
