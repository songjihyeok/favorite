/**
 * 프롬프트 빌더 클래스
 * 사용자의 선택 정보를 Stable Diffusion API용 프롬프트로 변환
 */

export interface IdealTypeOptions {
    gender: string;
    age: string;
    bodyType: string;
    style: string;
    personality: string; // 테토 vs 에겐
    faceType: string; // 얼굴형
    customText?: string;
}

export class PromptBuilder {
    private static readonly GENDER_MAP: Record<string, string> = {
        남성: 'handsome man, masculine features',
        여성: 'beautiful woman, feminine features',
        중성: 'androgynous person, gender-neutral features',
    };

    private static readonly AGE_MAP: Record<string, string> = {
        '10대': 'teenager, youthful, age 15-19',
        '20대': 'young adult, age 20-29',
        '30대': 'adult, age 30-39',
        '40대': 'mature adult, age 40-49',
    };

    private static readonly BODY_TYPE_MAP: Record<string, string> = {
        마른: 'slim, slender body',
        보통: 'average build, normal body type',
        탄탄한: 'athletic, fit body, toned muscles',
        근육질: 'muscular, well-built physique',
    };

    private static readonly STYLE_MAP: Record<string, string> = {
        캐주얼: 'casual style, comfortable clothing',
        포멀: 'formal attire, elegant suit or dress',
        스트리트: 'streetwear, urban fashion, trendy',
        스포티: 'sporty style, athletic wear',
        빈티지: 'vintage fashion, retro style',
        미니멀: 'minimalist fashion, simple elegant clothing',
    };

    private static readonly PERSONALITY_MAP: Record<string, string> = {
        테토: 'soft personality, gentle demeanor, warm and approachable, kind expression, friendly eyes',
        에겐: 'sharp personality, confident attitude, intense gaze, strong presence, charismatic expression',
        혼합: 'balanced personality, versatile character, adaptable expression',
    };

    private static readonly FACE_TYPE_MAP: Record<string, string> = {
        계란형: 'oval face shape, balanced proportions',
        둥근형: 'round face shape, soft curves',
        각진형: 'angular face shape, defined jawline',
        긴형: 'long face shape, elongated features',
    };

    private static readonly BASE_PROMPT =
        'full body shot, full body visible, head to toe, complete body in frame, high quality portrait, professional photography, 8k resolution, detailed, realistic';

    private static readonly NEGATIVE_PROMPT =
        'nsfw, nude, naked, sexual content, inappropriate, low quality, blurry, distorted, ugly, deformed, ' +
        'bad anatomy, extra limbs, mutated, disfigured, cartoon, anime, illustration, painting';

    /**
     * 사용자 선택사항을 Stable Diffusion 프롬프트로 변환
     */
    public static buildPrompt(options: IdealTypeOptions): string {
        const promptParts: string[] = [this.BASE_PROMPT];

        // 성별
        if (options.gender && this.GENDER_MAP[options.gender]) {
            promptParts.push(this.GENDER_MAP[options.gender]);
        }

        // 나이
        if (options.age && this.AGE_MAP[options.age]) {
            promptParts.push(this.AGE_MAP[options.age]);
        }

        // 체형
        if (options.bodyType && this.BODY_TYPE_MAP[options.bodyType]) {
            promptParts.push(this.BODY_TYPE_MAP[options.bodyType]);
        }

        // 스타일
        if (options.style && this.STYLE_MAP[options.style]) {
            promptParts.push(this.STYLE_MAP[options.style]);
        }

        // 성격 (표정으로 표현)
        if (options.personality && this.PERSONALITY_MAP[options.personality]) {
            promptParts.push(this.PERSONALITY_MAP[options.personality]);
        }

        // 얼굴형 (에겐 vs 테토)
        if (options.faceType && this.FACE_TYPE_MAP[options.faceType]) {
            promptParts.push(this.FACE_TYPE_MAP[options.faceType]);
        }

        // 사용자 커스텀 텍스트
        if (options.customText && options.customText.trim()) {
            // NSFW 필터링을 위한 기본 체크
            const sanitizedText = this.sanitizeCustomText(options.customText.trim());
            if (sanitizedText) {
                promptParts.push(sanitizedText);
            }
        }

        return promptParts.join(', ');
    }

    /**
     * 네거티브 프롬프트 반환
     */
    public static getNegativePrompt(): string {
        return this.NEGATIVE_PROMPT;
    }

    /**
     * 사용자 입력 텍스트 정제 (NSFW 필터)
     */
    private static sanitizeCustomText(text: string): string {
        const bannedWords = [
            'nude', 'naked', 'nsfw', 'sex', 'sexual', 'porn', 'xxx',
            '벗은', '나체', '야한', '섹시', '성적', '음란'
        ];

        const lowerText = text.toLowerCase();
        for (const word of bannedWords) {
            if (lowerText.includes(word.toLowerCase())) {
                return ''; // 금지어 포함 시 텍스트 제거
            }
        }

        // 30자 제한
        return text.substring(0, 30);
    }

    /**
     * 프롬프트 유효성 검증
     */
    public static validateOptions(options: IdealTypeOptions): {
        valid: boolean;
        error?: string
    } {
        if (!options.gender) {
            return { valid: false, error: '성별을 선택해주세요.' };
        }

        if (!options.age) {
            return { valid: false, error: '나이대를 선택해주세요.' };
        }

        if (!options.bodyType) {
            return { valid: false, error: '체형을 선택해주세요.' };
        }

        if (!options.style) {
            return { valid: false, error: '스타일을 선택해주세요.' };
        }

        if (!options.personality) {
            return { valid: false, error: '성격을 선택해주세요.' };
        }

        if (!options.faceType) {
            return { valid: false, error: '얼굴형을 선택해주세요.' };
        }

        return { valid: true };
    }
}

