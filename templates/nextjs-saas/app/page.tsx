import { Badge, Button, Card, CardBody, CardHeader, Text } from "@skyface/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
      <div className="flex items-center gap-3">
        <Text variant="h1">Skyface SaaS</Text>
        <Badge tone="primary">next.js</Badge>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <Text variant="h2">시작하기</Text>
          <Text variant="caption">@skyface/ui 컴포넌트로 구성된 페이지입니다.</Text>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <Button fullWidth>대시보드로 이동</Button>
          <Button variant="secondary" fullWidth>
            문서 보기
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
