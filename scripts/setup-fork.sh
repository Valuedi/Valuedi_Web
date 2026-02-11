#!/bin/bash

# Organization 저장소를 개인 포크로 설정하는 스크립트

set -e

echo "🔧 개인 포크 설정을 시작합니다..."

# GitHub CLI 인증 확인
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub CLI에 로그인되어 있지 않습니다."
    echo "다음 명령어로 로그인하세요:"
    echo "  gh auth login"
    exit 1
fi

# 현재 사용자 정보 가져오기
GITHUB_USER=$(gh api user -q .login)
echo "👤 GitHub 사용자: $GITHUB_USER"

# Organization 저장소 정보
ORG_REPO="Valuedi/Valuedi_Web"
FORK_REPO="$GITHUB_USER/Valuedi_Web"

echo "📦 Organization 저장소: $ORG_REPO"
echo "🍴 포크할 저장소: $FORK_REPO"

# 포크가 이미 존재하는지 확인
if gh repo view "$FORK_REPO" &>/dev/null; then
    echo "✅ 포크가 이미 존재합니다: $FORK_REPO"
else
    echo "🍴 포크 생성 중..."
    gh repo fork "$ORG_REPO" --clone=false
    echo "✅ 포크 생성 완료!"
fi

# 현재 origin 확인
CURRENT_ORIGIN=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_ORIGIN" == *"Valuedi/Valuedi_Web"* ]]; then
    echo "🔄 origin을 개인 포크로 변경 중..."
    git remote set-url origin "https://github.com/$FORK_REPO.git"
    echo "✅ origin이 개인 포크로 변경되었습니다"
fi

# upstream이 없으면 추가
if ! git remote | grep -q "^upstream$"; then
    echo "➕ upstream remote 추가 중..."
    git remote add upstream "https://github.com/$ORG_REPO.git"
    echo "✅ upstream이 추가되었습니다"
else
    echo "✅ upstream이 이미 설정되어 있습니다"
fi

# 원격 저장소 확인
echo ""
echo "📋 현재 원격 저장소 설정:"
git remote -v

echo ""
echo "✅ 설정 완료!"
echo ""
echo "이제 다음 명령어로 동기화할 수 있습니다:"
echo "  ./scripts/sync-from-upstream.sh"
echo ""
echo "또는 package.json의 스크립트를 사용하세요:"
echo "  npm run sync:upstream"
