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
        남성: '잘생긴 남성, 남성적인 특징',
        여성: '아름다운 여성, 여성적인 특징',
        중성: '중성적인 사람, 성별 중립적 특징',
    };

    private static readonly AGE_MAP: Record<string, string> = {
        '10대': '10대, 청소년, 15-19세',
        '20대': '20대, 젊은 성인, 20-29세',
        '30대': '30대, 성인, 30-39세',
        '40대': '40대, 성숙한 성인, 40-49세',
    };

    private static readonly BODY_TYPE_MAP: Record<string, string> = {
        마른: '마른 체형, 슬림한 몸',
        보통: '보통 체격, 일반적인 체형',
        탄탄한: '운동선수형, 탄탄한 몸, 탄탄한 근육',
        근육질: '근육질, 잘 발달된 체격',
    };

    private static readonly STYLE_MAP: Record<string, string> = {
        캐주얼: '캐주얼 스타일, 편안한 옷',
        포멀: '포멀한 복장, 우아한 정장이나 드레스',
        스트리트: '스트리트 패션, 도시적 패션, 트렌디함',
        스포티: '스포티 스타일, 운동복',
        빈티지: '빈티지 패션, 레트로 스타일',
        미니멀: '미니멀 패션, 심플하고 우아한 옷',
    };

    private static readonly PERSONALITY_MAP: Record<string, string> = {
        테토: '강한 성격, 강렬하고 카리스마 있음, 자신감 있는 태도, 강력한 존재감, 날카로운 눈빛, 지배적인 표정',
        에겐: '부드러운 성격, 온화하고 내향적, 친절한 태도, 따뜻하고 다가가기 쉬움, 친근한 눈빛, 다정한 표정',
        혼합: '균형잡힌 성격, 다재다능한 성격, 적응력 있는 표정',
    };

    private static readonly FACE_TYPE_MAP: Record<string, string> = {
        계란형: '계란형 얼굴, 균형잡힌 비율',
        둥근형: '둥근 얼굴형, 부드러운 곡선',
        각진형: '각진 얼굴형, 뚜렷한 턱선',
        긴형: '긴 얼굴형, 길쭉한 이목구비',
    };

    private static readonly BASE_PROMPT =
        '동양인, 한국인 특징, 전신 샷, 전신이 보이는, 머리부터 발끝까지, 프레임 안에 전체 몸, 고품질 인물사진, 전문 사진, 8K 해상도, 디테일한, 사실적인';

    private static readonly NEGATIVE_PROMPT =
        '성인물, 누드, 나체, 성적 콘텐츠, 부적절한, 낮은 품질, 흐릿한, 왜곡된, 못생긴, 변형된, ' +
        '나쁜 해부학, 추가 팔다리, 돌연변이, 일그러진, 만화, 애니메이션, 일러스트, 그림';

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

