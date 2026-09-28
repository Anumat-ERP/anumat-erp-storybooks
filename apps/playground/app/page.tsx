import { Button, Card, CardHeader, Stack, Text } from '@repo/ui';

export default function Page() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <Text variant="heading" as="h1">Playground</Text>
      <Card>
        <Stack gap={3} align="start">
          <CardHeader title="It works" description="@repo/ui rendered by Next." />
          <Button variant="primary">Primary action</Button>
        </Stack>
      </Card>
    </main>
  );
}
