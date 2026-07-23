import { Button } from '@/primitives/Button/Button';
import { Text } from '@/primitives/Text/Text';

export default function NotFound() {
  return (
    <section
      style={{
        minBlockSize: '100vh',
        display: 'grid',
        placeContent: 'center',
        gap: 'var(--m-6)',
        paddingInline: 'calc(var(--grid-rail) + var(--m-6))',
        textAlign: 'left',
      }}
    >
      <Text as="span" scale="m3" tone="zinc">
        ERROR 404 · SHEET NOT IN SET
      </Text>
      <Text as="h1" scale="d3">
        This sheet does not exist.
      </Text>
      <Text as="p" scale="b2" tone="zinc">
        The drawing you asked for is not in this set. Return to the title sheet.
      </Text>
      <div>
        <Button tier="secondary" href="/">
          Back to home
        </Button>
      </div>
    </section>
  );
}
