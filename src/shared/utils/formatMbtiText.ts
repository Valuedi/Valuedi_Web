/**
 * 텍스트 내 불필요한 공백 및 연속된 줄바꿈 제거
 * @param text - 가공할 원본 문자열
 * @returns 양 끝 공백이 제거되고 연속 줄바꿈이 하나로 합쳐진 문자열
 */
export const cleanWhitespace = (text: string | undefined): string => {
  if (!text) return '';
  return text
    .replace(/\n\s*\n/g, '\n') // 연속 줄바꿈(\n\n)을 한 번(\n)으로 치환
    .trim();
};

/**
 * 딱딱한 문체(~다.)를 사용자 친화적인 말투(~요.)로 변환
 * @param text - 변환할 원본 문자열
 * @returns 부드러운 말투로 변환된 문자열
 */
export const convertToFriendlyTone = (text: string | undefined): string => {
  if (!text) return '';

  return text
    .replace(/스럽습니다\./g, '스러워요.')
    .replace(/맞습니다\./g, '맞아요.')
    .replace(/적절합니다\./g, '적절해요.')
    .replace(/합니다\./g, '해요.')
    .replace(/입니다\./g, '이에요.')
    .replace(/있습니다\./g, '있어요.')
    .replace(/않습니다\./g, '않아요.')
    .replace(/됩니다\./g, '돼요.')
    .replace(/봅니다\./g, '봐요.')
    .replace(/큽니다\./g, '커요.')
    .replace(/둡니다\./g, '둬요.')
    .replace(/옮깁니다\./g, '옮겨요.')
    .replace(/아닙니다\./g, '아니에요.')
    .replace(/여깁니다\./g, '여겨요.')
    .replace(/즐깁니다\./g, '즐겨요.')
    .replace(/가집니다\./g, '가져요.')
    .replace(/빠집니다\./g, '빠져요.')
    .replace(/어렵습니다\./g, '어려워요.')
    .replace(/쉽습니다\./g, '쉬워요.')
    .replace(/만듭니다\./g, '만들어요.')

    .replace(/립니다\./g, '려요.')
    .replace(/집니다\./g, '져요.')
    .replace(/줍니다\./g, '줘요.')
    .replace(/옵니다\./g, '와요.')
    .replace(/웁니다\./g, '워요.')

    .replace(/좋습니다\./g, '좋아요.')
    .replace(/많습니다\./g, '많아요.')
    .replace(/적습니다\./g, '적어요.')

    .replace(/않습니다\./g, '않아요.')
    .replace(/싶습니다\./g, '싶어요.')
    .replace(/겠습니다\./g, '겠어요.')
    .replace(/느낍니다\./g, '느껴요.')
    .replace(/나타납니다\./g, '나타나요.')
    .replace(/생각합니다\./g, '생각해요.')
    .replace(/결정합니다\./g, '결정해요.')
    .replace(/발생합니다\./g, '발생해요.');
};

/**
 * MBTI 결과 설명을 위한 종합 텍스트 포맷팅
 * (공백 제거와 말투 변환을 순차적으로 수행)
 * @param text - 가공할 원본 문자열
 * @returns 공백이 정리되고 말투가 변환된 최종 문자열
 */
export const formatMbtiDescription = (text: string | undefined): string => {
  const cleaned = cleanWhitespace(text);
  return convertToFriendlyTone(cleaned);
};
