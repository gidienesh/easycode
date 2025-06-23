# Mantine v8 Quick Reference

## Layout Components

### AppShell
```tsx
import { AppShell } from '@mantine/core';

<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm' }}
  padding="md"
>
  <AppShell.Header p="md">
    {/* Header content */}
  </AppShell.Header>
  
  <AppShell.Navbar p="md">
    {/* Navbar content */}
  </AppShell.Navbar>
  
  <AppShell.Main>
    {/* Main content */}
  </AppShell.Main>
</AppShell>
```

### Container
```tsx
import { Container } from '@mantine/core';

<Container size="xl" py="xl">
  {/* Content */}
</Container>
```

### Grid
```tsx
import { Grid, Col } from '@mantine/core';

<Grid>
  <Col span={{ base: 12, sm: 6, lg: 4 }}>
    {/* Content */}
  </Col>
</Grid>
```

## Navigation Components

### NavLink
```tsx
import { NavLink } from '@mantine/core';

<NavLink
  label="Dashboard"
  leftSection={<IconDashboard size="1rem" />}
  active={isActive}
  onClick={handleClick}
/>
```

### Tabs
```tsx
import { Tabs } from '@mantine/core';

<Tabs defaultValue="first">
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panel value="first">First panel</Tabs.Panel>
  <Tabs.Panel value="second">Second panel</Tabs.Panel>
</Tabs>
```

## Form Components

### TextInput
```tsx
import { TextInput } from '@mantine/core';

<TextInput
  label="Email"
  placeholder="Enter your email"
  required
  error={errors.email}
/>
```

### Select
```tsx
import { Select } from '@mantine/core';

<Select
  label="Country"
  placeholder="Pick a country"
  data={['US', 'UK', 'CA']}
  required
/>
```

### Checkbox
```tsx
import { Checkbox } from '@mantine/core';

<Checkbox
  label="I agree to terms"
  required
/>
```

### Button
```tsx
import { Button } from '@mantine/core';

<Button variant="filled" color="blue" size="md">
  Click me
</Button>
```

## Display Components

### Card
```tsx
import { Card, Text, Group } from '@mantine/core';

<Card shadow="sm" p="lg" radius="md">
  <Text size="lg" fw={500} mb="md">
    Card Title
  </Text>
  <Text size="sm" c="dimmed">
    Card content
  </Text>
</Card>
```

### Text
```tsx
import { Text } from '@mantine/core';

<Text size="lg" fw={500} c="blue">
  Styled text
</Text>
```

### Badge
```tsx
import { Badge } from '@mantine/core';

<Badge color="green" size="sm">
  Success
</Badge>
```

### Alert
```tsx
import { Alert } from '@mantine/core';

<Alert color="blue" title="Info">
  This is an informational message.
</Alert>
```

## Data Display

### Table
```tsx
import { Table } from '@mantine/core';

<Table>
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Email</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    <Table.Tr>
      <Table.Td>John Doe</Table.Td>
      <Table.Td>john@example.com</Table.Td>
    </Table.Tr>
  </Table.Tbody>
</Table>
```

### List
```tsx
import { List } from '@mantine/core';

<List>
  <List.Item>First item</List.Item>
  <List.Item>Second item</List.Item>
</List>
```

## Feedback Components

### Modal
```tsx
import { Modal } from '@mantine/core';

<Modal opened={opened} onClose={close} title="Modal Title">
  Modal content
</Modal>
```

### Notification
```tsx
import { notifications } from '@mantine/notifications';

notifications.show({
  title: 'Success',
  message: 'Operation completed successfully',
  color: 'green'
});
```

### LoadingOverlay
```tsx
import { LoadingOverlay } from '@mantine/core';

<LoadingOverlay visible={loading} />
```

## Utility Components

### Group
```tsx
import { Group } from '@mantine/core';

<Group gap="md" justify="space-between">
  <Button>Left</Button>
  <Button>Right</Button>
</Group>
```

### Stack
```tsx
import { Stack } from '@mantine/core';

<Stack gap="md">
  <Text>First item</Text>
  <Text>Second item</Text>
</Stack>
```

### Divider
```tsx
import { Divider } from '@mantine/core';

<Divider my="md" />
```

## Responsive Design

### Responsive Props
```tsx
// Responsive spacing
<Group gap={{ base: 'xs', sm: 'md', lg: 'lg' }}>

// Responsive sizes
<Button size={{ base: 'xs', sm: 'sm', lg: 'md' }}>

// Responsive columns
<Col span={{ base: 12, sm: 6, lg: 4 }}>
```

### Media Queries
```tsx
import { useMediaQuery } from '@mantine/hooks';

const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
```

## Common Props

### Spacing
- `p` - padding
- `px` - horizontal padding
- `py` - vertical padding
- `m` - margin
- `mx` - horizontal margin
- `my` - vertical margin

### Sizes
- `xs`, `sm`, `md`, `lg`, `xl`

### Colors
- `blue`, `green`, `red`, `yellow`, `gray`, etc.

### Variants
- `filled`, `outline`, `light`, `subtle`, `transparent`

## CSS Custom Properties

### Colors
```css
var(--mantine-color-blue-6)
var(--mantine-color-gray-3)
var(--mantine-color-red-9)
```

### Spacing
```css
var(--mantine-spacing-xs)  /* 8px */
var(--mantine-spacing-sm)  /* 16px */
var(--mantine-spacing-md)  /* 24px */
var(--mantine-spacing-lg)  /* 32px */
var(--mantine-spacing-xl)  /* 48px */
```

### Radius
```css
var(--mantine-radius-xs)   /* 4px */
var(--mantine-radius-sm)   /* 6px */
var(--mantine-radius-md)   /* 8px */
var(--mantine-radius-lg)   /* 12px */
var(--mantine-radius-xl)   /* 16px */
```

## Theme Configuration

### Basic Theme
```tsx
import { MantineProvider } from '@mantine/core';

const theme = {
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
};

<MantineProvider theme={theme}>
  {/* App */}
</MantineProvider>
```

## Common Patterns

### Form with Validation
```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    password: (value) => (value.length < 6 ? 'Password too short' : null),
  },
});

<form onSubmit={form.onSubmit(handleSubmit)}>
  <TextInput
    label="Email"
    {...form.getInputProps('email')}
  />
  <TextInput
    label="Password"
    type="password"
    {...form.getInputProps('password')}
  />
  <Button type="submit">Submit</Button>
</form>
```

### Conditional Rendering
```tsx
{loading ? (
  <LoadingOverlay visible />
) : (
  <Card>
    {/* Content */}
  </Card>
)}
```

### Error Boundaries
```tsx
import { Alert } from '@mantine/core';

{error && (
  <Alert color="red" title="Error">
    {error.message}
  </Alert>
)}
```

## Migration Checklist

- [ ] Replace `Navbar` with `AppShell.Navbar`
- [ ] Replace `Header` with `AppShell.Header`
- [ ] Change `icon` to `leftSection` in `NavLink`
- [ ] Change `padding` to `p` in `Card`
- [ ] Remove `hiddenBreakpoint` from AppShell components
- [ ] Update theme configuration (remove `colorScheme`)
- [ ] Use CSS custom properties for styling
- [ ] Test responsive behavior
- [ ] Verify accessibility attributes 