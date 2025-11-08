import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { PromptBuilder, IdealTypeOptions } from '@/lib/promptBuilder';

/**
 * 이미지 생성 API Route
 * POST /api/generate
 */
export async function POST(request: NextRequest) {
  try {
    // 환경 변수에서 Replicate API 토큰 가져오기
    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!replicateApiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Replicate API 토큰이 설정되지 않았습니다. .env.local 파일을 확인해주세요.' 
        },
        { status: 500 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const options: IdealTypeOptions = body;

    // 옵션 유효성 검증
    const validation = PromptBuilder.validateOptions(options);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error 
        },
        { status: 400 }
      );
    }

    // 프롬프트 생성
    const prompt = PromptBuilder.buildPrompt(options);
    const negativePrompt = PromptBuilder.getNegativePrompt();

    console.log('생성된 프롬프트:', prompt);
    console.log('네거티브 프롬프트:', negativePrompt);

    // Replicate API 클라이언트 초기화
    const replicate = new Replicate({
      auth: replicateApiToken,
    });

    // Stable Diffusion 모델 실행
    // SDXL 모델 사용 (고품질 이미지 생성)
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        }
      }
    ) as string[];

    // 생성된 이미지 URL 확인
    if (!output || output.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: '이미지 생성에 실패했습니다. 다시 시도해주세요.' 
        },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      imageUrl: output[0],
      prompt: prompt,
      negativePrompt: negativePrompt,
    });

  } catch (error) {
    console.error('이미지 생성 오류:', error);
    
    // 에러 타입에 따른 처리
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: `이미지 생성 중 오류가 발생했습니다: ${error.message}` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

// GET 메서드는 지원하지 않음
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'POST 메서드만 지원됩니다.' 
    },
    { status: 405 }
  );
}


