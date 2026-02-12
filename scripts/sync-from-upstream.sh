#!/bin/bash

# Organization 저장소의 최신 변경사항을 개인 포크로 동기화하는 스크립트

set -e

echo "🔄 Organization 저장소에서 최신 변경사항 가져오는 중..."

# upstream이 설정되어 있는지 확인
if ! git remote | grep -q "^upstream$"; then
    echo "❌ upstream remote가 설정되어 있지 않습니다."
    echo "다음 명령어로 설정하세요:"
    echo "  git remote add upstream https://github.com/Valuedi/Valuedi_Web.git"
    exit 1
fi

# 현재 브랜치 저장
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 현재 브랜치: $CURRENT_BRANCH"

# upstream에서 최신 변경사항 가져오기
echo "📥 upstream에서 fetch 중..."
git fetch upstream

# main 브랜치로 전환
echo "🔄 main 브랜치로 전환 중..."
git checkout main

# upstream/main을 main에 병합
echo "🔀 upstream/main을 main에 병합 중..."
git merge upstream/main --no-edit

# 개인 포크에 푸시
echo "📤 개인 포크(origin)에 푸시 중..."
git push origin main

# 원래 브랜치로 돌아가기
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 원래 브랜치($CURRENT_BRANCH)로 돌아가는 중..."
    git checkout "$CURRENT_BRANCH"
fi

echo "✅ 동기화 완료!"
