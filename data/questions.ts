import type { Question } from "@/types";

/**
 * DBTI 35문항 — PRD §3 (v2 수정안)
 * 분포: CF 6 / QM 7 / AD 7 / PS 7 / TH 8 = 35
 *
 * 변경 이력 (v2):
 *  - Q3(고속도로 차간거리) 삭제
 *  - Q29(LKAS+ACC) 를 두 문항으로 분리: 차로유지보조 / 스마트 크루즈
 *  - Q1 옵션 라벨을 "초근접/근접/여유/상당히 여유" + 인터랙티브 그림
 *  - Q2 인터랙티브 그림(시내 주행) 추가
 *  - Q11 인터랙티브 그림(황색 신호) 추가
 *  - 일부 옵션 문구 수정 (Q5, Q6, Q10, Q35)
 *
 * 점수 규칙: 음수(-2,-1) = 첫 글자(Q,C,A,P,T) / 양수(+1,+2) = 둘째 글자(M,F,D,S,H)
 */
export const QUESTIONS: Question[] = [
  // ── CF (차간 거리) 6Q ──
  {
    id: 1,
    axis: "CF",
    category: "차간 거리",
    interactive: "follow-distance-stop",
    text: "신호 대기로 정지했을 때, 앞차와의 거리는 보통 어느 정도인가요?",
    help: "버튼을 눌러 보세요 — 운전석에서 본 앞차의 모습이 함께 바뀝니다.",
    options: [
      { text: "초근접 — 앞차 트렁크 커버 정도가 보일 정도", score: -2 },
      { text: "근접 — 번호판이 또렷이 보임", score: -1 },
      { text: "여유 — 앞차 전체와 도로가 보임", score: 1 },
      { text: "상당히 여유 — 앞차와 거리 충분", score: 2 },
    ],
  },
  {
    id: 2,
    axis: "CF",
    category: "차간 거리",
    interactive: "follow-distance-city",
    text: "시내 주행 중(시속 50~60km), 앞차와의 거리는 보통?",
    help: "버튼을 눌러 보세요 — 도로 위 앞차와의 간격이 함께 바뀝니다.",
    options: [
      { text: "차 한 대 들어갈 정도", score: -2 },
      { text: "차 1~2대 정도", score: -1 },
      { text: "차 2~3대 정도", score: 1 },
      { text: "차 3대 이상, 충분히", score: 2 },
    ],
  },
  {
    id: 3,
    axis: "CF",
    category: "차간 거리",
    text: "꽉 막힌 정체 구간에서 앞차와의 거리 유지 방식은?",
    options: [
      { text: "한 치라도 더 붙어 끼어들기 방지", score: -2 },
      { text: "적당히 붙는 편", score: -1 },
      { text: "평소 거리감 유지", score: 1 },
      { text: "옆 차가 끼어들 만큼 충분히 둠", score: 2 },
    ],
  },
  {
    id: 4,
    axis: "CF",
    category: "차간 거리",
    text: "앞 차량이 트럭이나 버스일 때는?",
    options: [
      { text: "평소대로 가까이", score: -2 },
      { text: "살짝 거리만 둠", score: -1 },
      { text: "한 차량 분량정도 더 띄움", score: 1 },
      { text: "시야가 답답해 거리를 크게 두거나 차로 변경", score: 2 },
    ],
  },
  {
    id: 5,
    axis: "CF",
    category: "차간 거리",
    text: "뒤차가 바짝 붙어올 때 본인의 반응은?",
    options: [
      { text: "신경 안 쓰고 평소대로", score: -2 },
      { text: "거슬리지만 그대로 간다", score: -1 },
      { text: "거리를 두려고 좀더 빠르게 달림", score: 1 },
      { text: "비켜준다 (옆 차로로 양보)", score: 2 },
    ],
  },
  {
    id: 6,
    axis: "CF",
    category: "차간 거리",
    text: "비/빗길 주행 시, 평소 대비 앞차와의 거리 변화는?",
    options: [
      { text: "평소 그대로 유지", score: -2 },
      { text: "살짝만 더 둔다", score: -1 },
      { text: "평소의 1.5배 이상 둔다", score: 1 },
      { text: "평소의 2배 이상 둔다", score: 2 },
    ],
  },

  // ── QM (속도) 7Q ──
  {
    id: 7,
    axis: "QM",
    category: "속도",
    text: "제한속도 60km 도로에서 보통 어느 정도 속도로 주행하시나요?",
    options: [
      { text: "75km/h 이상", score: -2 },
      { text: "65~75km/h", score: -1 },
      { text: "60~65km/h", score: 1 },
      { text: "55km/h 이하 (제한속도 안쪽)", score: 2 },
    ],
  },
  {
    id: 8,
    axis: "QM",
    category: "속도",
    text: "고속도로 제한속도 110km 구간에서 본인의 평균 속도는?",
    options: [
      { text: "125km/h 이상", score: -2 },
      { text: "110~125km/h", score: -1 },
      { text: "100~110km/h", score: 1 },
      { text: "100km/h 이하", score: 2 },
    ],
  },
  {
    id: 9,
    axis: "QM",
    category: "속도",
    text: "신호가 녹색으로 막 바뀌었을 때, 출발은?",
    options: [
      { text: "신호 보자마자 즉시", score: -2 },
      { text: "앞차 출발과 동시에", score: -1 },
      { text: "앞차가 출발하고 바로 따라서 출발", score: 1 },
      { text: "앞차가 출발하고 충분히 여유를 두고 출발", score: 2 },
    ],
  },
  {
    id: 10,
    axis: "QM",
    category: "속도",
    interactive: "yellow-light-approach",
    text: "황색 신호를 발견했고, 정지선까지 약 10m 남았습니다. 보통 어떻게?",
    help: "정지선까지의 거리를 떠올리며 선택해 보세요.",
    options: [
      { text: "가속해서 무조건 통과", score: -2 },
      { text: "거리 보고 빠르게 통과", score: -1 },
      { text: "거리 보고 정지", score: 1 },
      { text: "무조건 정지", score: 2 },
    ],
  },
  {
    id: 11,
    axis: "QM",
    category: "속도",
    text: "차량이 거의 없는 빈 도로에서 본인의 운전 스타일은?",
    options: [
      { text: "마음껏 밟는 편", score: -2 },
      { text: "평소보다 좀 더 빠르게", score: -1 },
      { text: "평소와 비슷하게", score: 1 },
      { text: "흐름이 없으니 더 천천히", score: 2 },
    ],
  },
  {
    id: 12,
    axis: "QM",
    category: "속도",
    text: "약속에 늦었을 때, 운전 스타일은 어떻게 변하나요?",
    options: [
      { text: "적극적으로 빨리 가려 함, 차로 자주 변경", score: -2 },
      { text: "살짝 빠르게, 가끔 차로 변경", score: -1 },
      { text: "약간 빠르게 가는 정도", score: 1 },
      { text: "평소대로, 늦으면 늦는 거", score: 2 },
    ],
  },
  {
    id: 13,
    axis: "QM",
    category: "속도",
    text: "야간 운전 선호도와 행동은?",
    options: [
      { text: "한적해서 오히려 즐긴다", score: -2 },
      { text: "평소와 차이 없음", score: -1 },
      { text: "평소보다 좀 더 신중히", score: 1 },
      { text: "가능하면 피하고 싶다", score: 2 },
    ],
  },

  // ── AD (추월·결정) 7Q ──
  {
    id: 14,
    axis: "AD",
    category: "추월·결정",
    text: "1차로에서 앞차가 천천히 갑니다. 보통 어떻게 하시나요?",
    options: [
      { text: "라이트나 깜빡이로 신호 후 적극 추월", score: -2 },
      { text: "기회 보고 추월", score: -1 },
      { text: "답답해도 그냥 따라간다", score: 1 },
      { text: "천천히 가는 게 편하다", score: 2 },
    ],
  },
  {
    id: 15,
    axis: "AD",
    category: "추월·결정",
    text: "본인의 추월 빈도를 자가 평가한다면?",
    options: [
      { text: "더 빠른 차로를 계속 찾는다", score: -2 },
      { text: "답답하다 싶으면 자주", score: -1 },
      { text: "꼭 필요할 때만", score: 1 },
      { text: "거의 안 한다", score: 2 },
    ],
  },
  {
    id: 16,
    axis: "AD",
    category: "추월·결정",
    text: "차선을 변경할 때 깜빡이를 켜는 타이밍은?",
    options: [
      { text: "핸들 돌리면서 (또는 안 켤 때도)", score: -2 },
      { text: "변경 직전 1초 전쯤", score: -1 },
      { text: "3초 전쯤 미리", score: 1 },
      { text: "한참 미리 켠다", score: 2 },
    ],
  },
  {
    id: 17,
    axis: "AD",
    category: "추월·결정",
    text: "옆 차로가 빠르게 빠지고 있을 때 어떻게 하시나요?",
    options: [
      { text: "즉시 옮긴다", score: -2 },
      { text: "옮길까 고민하다 결국 옮김", score: -1 },
      { text: "그대로 있는 편", score: 1 },
      { text: "경험상 옮기면 더 막혔던 적이 많아서 안 옮김", score: 2 },
    ],
  },
  {
    id: 18,
    axis: "AD",
    category: "추월·결정",
    text: "갑자기 끼어드는 차에 대한 반응은?",
    options: [
      { text: "클락션, 라이트로 항의 표시", score: -2 },
      { text: "속으로 욕한다", score: -1 },
      { text: "거리를 더 두며 양보", score: 1 },
      { text: "그러려니, 그냥 받아들인다", score: 2 },
    ],
  },
  {
    id: 19,
    axis: "AD",
    category: "추월·결정",
    text: "무례한 운전자(욕설·삿대질)를 마주쳤을 때?",
    options: [
      { text: "정면 대응 (창문 내림 등)", score: -2 },
      { text: "속으로 화나서 표정 굳음", score: -1 },
      { text: "무시하고 지나감", score: 1 },
      { text: "빨리 멀어지고 싶다", score: 2 },
    ],
  },
  {
    id: 20,
    axis: "AD",
    category: "추월·결정",
    text: "좁은 골목에서 마주 오는 차를 만났을 때?",
    options: [
      { text: "자신 있게 핸들 꺾어 통과", score: -2 },
      { text: "양보 받고 싶다 (눈치 봄)", score: -1 },
      { text: "바로 양보한다", score: 1 },
      { text: "필요하면 후진해서 비켜준다", score: 2 },
    ],
  },

  // ── PS (계획성) 7Q ──
  {
    id: 21,
    axis: "PS",
    category: "주차·계획",
    text: "마트/백화점 주차장에 도착했을 때, 자리 찾는 방식은?",
    options: [
      { text: "외진 곳을 미리 정해두고 그쪽으로", score: -2 },
      { text: "한 바퀴 돌며 좋은 자리 탐색", score: -1 },
      { text: "입구 근처에서 보이는 자리", score: 1 },
      { text: "빈자리 보이면 무조건 즉시", score: 2 },
    ],
  },
  {
    id: 22,
    axis: "PS",
    category: "주차·계획",
    text: "길을 잘못 들었음을 깨달았을 때 보통 어떻게?",
    options: [
      { text: "미리 다음 길을 검색·계획한 뒤 정확한 지점에서 조치", score: -2 },
      { text: "내비 재안내를 따른다", score: -1 },
      { text: "다음 신호에서 즉시 조치", score: 1 },
      { text: "즉시 그 자리에서 유턴/꺾기", score: 2 },
    ],
  },
  {
    id: 23,
    axis: "PS",
    category: "주차·계획",
    text: "운전석에 앉아 시동을 켠 직후, 보통 무엇을 하시나요?",
    options: [
      { text: "거울·시트 점검, 내비·음악 다 세팅 후 출발", score: -2 },
      { text: "내비만 세팅하고 출발", score: -1 },
      { text: "일단 출발하면서 음악·세팅 조작", score: 1 },
      { text: "그냥 즉시 출발", score: 2 },
    ],
  },
  {
    id: 24,
    axis: "PS",
    category: "주차·계획",
    text: "차로가 줄어드는 합류 구간에서 본인의 행동은?",
    options: [
      { text: "한참 미리 차로 변경", score: -2 },
      { text: "어느 정도 미리 변경", score: -1 },
      { text: "흐름 보고 결정", score: 1 },
      { text: "끝까지 가서 합류 (지퍼식)", score: 2 },
    ],
  },
  {
    id: 25,
    axis: "PS",
    category: "환경 대응",
    text: "짙은 안개·역광 같은 시야 제한 상황에서?",
    options: [
      { text: "미리 비상등·안개등 작동, 속도 미리 줄임", score: -2 },
      { text: "상황 보며 라이트 단계적 조절", score: -1 },
      { text: "일단 가다가 위험 감지하면 대응", score: 1 },
      { text: "평소대로 운전", score: 2 },
    ],
  },
  {
    id: 26,
    axis: "PS",
    category: "환경 대응",
    text: "눈길/빙판길 운전에 대한 본인 대응은?",
    options: [
      { text: "출발 전 차량·노선·체인 등 점검", score: -2 },
      { text: "평소보다 일찍 출발하며 신중하게", score: -1 },
      { text: "가다가 상황 보고 속도 조절", score: 1 },
      { text: "평소와 다름없이 (또는 자신감 있게)", score: 2 },
    ],
  },
  {
    id: 27,
    axis: "PS",
    category: "환경 대응",
    text: "장거리 운전을 앞두고, 보통 어떤 준비를 하시나요?",
    options: [
      { text: "휴게소 위치·시간·음악·연료까지 다 계획", score: -2 },
      { text: "대략적인 경로와 휴게 지점만 확인", score: -1 },
      { text: "내비 켜고 바로 출발", score: 1 },
      { text: "준비 없이 그냥 출발", score: 2 },
    ],
  },

  // ── TH (기술 친화) 8Q ──
  {
    id: 28,
    axis: "TH",
    category: "기술 친화",
    text: "차로유지보조(LKAS / LFA) 기능 사용 빈도는?",
    options: [
      { text: "거의 항상 켜둔다", score: -2 },
      { text: "고속도로 등에서 자주 사용", score: -1 },
      { text: "가끔 사용", score: 1 },
      { text: "거의 안 쓴다 / 차에 없다", score: 2 },
    ],
  },
  {
    id: 29,
    axis: "TH",
    category: "기술 친화",
    text: "스마트 크루즈 컨트롤(ACC) 기능 사용 빈도는?",
    options: [
      { text: "거의 항상 켜둔다", score: -2 },
      { text: "고속도로 등에서 자주 사용", score: -1 },
      { text: "가끔 사용", score: 1 },
      { text: "거의 안 쓴다 / 차에 없다", score: 2 },
    ],
  },
  {
    id: 30,
    axis: "TH",
    category: "기술 친화",
    text: "자동주차 기능에 대한 본인의 생각은?",
    options: [
      { text: "적극 사용, 매우 편하다", score: -2 },
      { text: "어려운 자리에서만 사용", score: -1 },
      { text: "한두 번 써본 정도", score: 1 },
      { text: "직접 하는 게 편함/믿음", score: 2 },
    ],
  },
  {
    id: 31,
    axis: "TH",
    category: "기술 친화",
    text: "HUD·디지털 클러스터 정보를 활용하는 정도는?",
    options: [
      { text: "가능한 정보 전부 띄워둠", score: -2 },
      { text: "필요한 정보만 띄움", score: -1 },
      { text: "기본 정보만 본다", score: 1 },
      { text: "신경 쓰지 않는다", score: 2 },
    ],
  },
  {
    id: 32,
    axis: "TH",
    category: "기술 친화",
    text: "내비 안내와 본인 판단이 다를 때, 보통 어떻게?",
    options: [
      { text: "무조건 내비 따른다", score: -2 },
      { text: "대부분 내비를 따른다", score: -1 },
      { text: "본인 판단을 우선한다", score: 1 },
      { text: "내비를 잘 보지 않는다", score: 2 },
    ],
  },
  {
    id: 33,
    axis: "TH",
    category: "기술 친화",
    text: "CarPlay·Android Auto·음성 명령 활용도는?",
    options: [
      { text: "모든 기능을 적극 활용", score: -2 },
      { text: "일부 기능만 활용", score: -1 },
      { text: "거의 안 쓴다", score: 1 },
      { text: "들어본 적 없거나 관심 없음", score: 2 },
    ],
  },
  {
    id: 34,
    axis: "TH",
    category: "기술 친화",
    text: '"자율주행이 더 안전해진다면 맡기겠다"에 대한 동의 정도는?',
    options: [
      { text: "매우 동의", score: -2 },
      { text: "동의하는 편", score: -1 },
      { text: "동의하지 않는 편", score: 1 },
      { text: "매우 비동의 (운전은 내가)", score: 2 },
    ],
  },
  {
    id: 35,
    axis: "TH",
    category: "기술 친화",
    text: "새 차 구매 시 본인의 우선순위는?",
    options: [
      { text: "자율주행·ADAS 옵션", score: -2 },
      { text: "인포테인먼트·편의장치", score: -1 },
      { text: "주행성능·반응성", score: 1 },
      { text: "내부 공간 활용도", score: 2 },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
